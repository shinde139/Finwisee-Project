package com.example.user.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.user.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // =========================================================
    // BASIC QUERIES
    // =========================================================

    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
    
    Page<Notification> findByUserUserId(Integer userId, Pageable pageable);

    List<Notification> findByUserUserIdAndIsReadFalse(Integer userId);

    List<Notification> findByUserUserIdAndType(Integer userId, String type);

    List<Notification> findByUserUserIdAndIsRead(Integer userId, Boolean isRead);

    List<Notification> findByUserUserIdAndCreatedAtBetween(
        Integer userId, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    // =========================================================
    // COUNT QUERIES
    // =========================================================

    Long countByUserUserIdAndIsReadFalse(Integer userId);

    Long countByUserUserId(Integer userId);

    Long countByUserUserIdAndType(Integer userId, String type);

    Long countByUserUserIdAndCreatedAtBetween(
        Integer userId, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    // =========================================================
    // DELETE QUERIES
    // =========================================================

    void deleteByUserUserId(Integer userId);

    // =========================================================
    // CUSTOM QUERIES
    // =========================================================

    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId AND " +
           "(LOWER(n.title) LIKE %:keyword% OR LOWER(n.message) LIKE %:keyword%) " +
           "ORDER BY n.createdAt DESC")
    List<Notification> searchByKeyword(
        @Param("userId") Integer userId, 
        @Param("keyword") String keyword
    );

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.userId = :userId AND n.isRead = false")
    Long countUnreadByUserId(@Param("userId") Integer userId);

    @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.user.userId = :userId GROUP BY n.type")
    List<Object[]> countByTypeGrouped(@Param("userId") Integer userId);

    @Query("SELECT DATE(n.createdAt), COUNT(n) FROM Notification n " +
           "WHERE n.user.userId = :userId GROUP BY DATE(n.createdAt) " +
           "ORDER BY DATE(n.createdAt) DESC")
    List<Object[]> countByDateGrouped(@Param("userId") Integer userId);
}