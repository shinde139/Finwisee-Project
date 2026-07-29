package com.example.user.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.user.entity.Notification;
import com.example.user.entity.User;
import com.example.user.repository.NotificationRepository;
import com.example.user.repository.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;

    // =========================================================
    // BASIC CRUD
    // =========================================================

    public String saveNotification(Integer userId, String title, String message, String type) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return "User not found with ID: " + userId;
            }
            
            User user = userOptional.get();
            
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notification.setUser(user);
            
            notificationRepository.save(notification);
            return "Notification saved successfully!";
            
        } catch (Exception e) {
            e.printStackTrace();
            return "Error saving notification: " + e.getMessage();
        }
    }

    public List<Notification> getNotifications(Integer userId) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification getNotificationById(Integer notificationId) {
        return notificationRepository.findById(notificationId).orElse(null);
    }

    public String markAsRead(Integer notificationId) {
        try {
            Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
            if (notificationOpt.isEmpty()) {
                return "Notification not found";
            }
            
            Notification notification = notificationOpt.get();
            notification.setIsRead(true);
            notificationRepository.save(notification);
            return "Notification marked as read!";
            
        } catch (Exception e) {
            e.printStackTrace();
            return "Error marking notification as read: " + e.getMessage();
        }
    }

    public String deleteNotification(Integer notificationId) {
        try {
            notificationRepository.deleteById(notificationId);
            return "Notification deleted successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting notification: " + e.getMessage();
        }
    }

    public String deleteAllNotifications(Integer userId) {
        try {
            notificationRepository.deleteByUserUserId(userId);
            return "All notifications deleted successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting notifications: " + e.getMessage();
        }
    }

    // =========================================================
    // PAGINATION & FILTERING
    // =========================================================

    public Page<Notification> getNotificationsPaginated(Integer userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return notificationRepository.findByUserUserId(userId, pageable);
    }

    public List<Notification> getNotificationsByType(Integer userId, String type) {
        return notificationRepository.findByUserUserIdAndType(userId, type);
    }

    public List<Notification> getUnreadNotifications(Integer userId) {
        return notificationRepository.findByUserUserIdAndIsReadFalse(userId);
    }

    // =========================================================
    // SUMMARY & STATISTICS
    // =========================================================

    public Long getUnreadCount(Integer userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    public Long getNotificationCount(Integer userId) {
        return notificationRepository.countByUserUserId(userId);
    }

    public List<Notification> getLatestNotifications(Integer userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return notificationRepository.findByUserUserId(userId, pageable).getContent();
    }

    public Long getCountByType(Integer userId, String type) {
        return notificationRepository.countByUserUserIdAndType(userId, type);
    }

    public Long getTodayCount(Integer userId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return notificationRepository.countByUserUserIdAndCreatedAtBetween(
            userId, startOfDay, endOfDay
        );
    }

    // =========================================================
    // BULK OPERATIONS
    // =========================================================

    public String markMultipleAsRead(List<Integer> notificationIds) {
        try {
            List<Notification> notifications = notificationRepository.findAllById(notificationIds);
            for (Notification notification : notifications) {
                notification.setIsRead(true);
            }
            notificationRepository.saveAll(notifications);
            return "Notifications marked as read!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public String markAllAsRead(Integer userId) {
        try {
            List<Notification> unread = notificationRepository.findByUserUserIdAndIsReadFalse(userId);
            for (Notification notification : unread) {
                notification.setIsRead(true);
            }
            notificationRepository.saveAll(unread);
            return "All notifications marked as read!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public String deleteMultipleNotifications(List<Integer> notificationIds) {
        try {
            notificationRepository.deleteAllById(notificationIds);
            return "Notifications deleted successfully!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // =========================================================
    // SEARCH & FILTER
    // =========================================================

    public List<Notification> searchNotifications(Integer userId, String keyword) {
        return notificationRepository.searchByKeyword(userId, keyword.toLowerCase());
    }

    public List<Notification> filterNotifications(Integer userId, Boolean isRead) {
        if (isRead == null) {
            return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        } else {
            return notificationRepository.findByUserUserIdAndIsRead(userId, isRead);
        }
    }
}