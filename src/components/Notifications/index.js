import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { formatDistance, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';

import api from '../../services/api';

import {
  Container,
  Badge,
  Scroll,
  NotificationList,
  Notification,
} from './styles';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      const response = await api
        .get('notifications')
        .catch(() => toast.error('oops, servidor falhou'));

      const data = response.data.map((notification) => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.updatedAt),
          new Date(),
          { locale: pt, addSuffix: true }
        ),
      }));
      if (data) {
        setNotifications(data);
      }
    }
    loadNotifications();
  }, []);

  const [visible, setVisible] = useState(false);

  function handleToggleVisible() {
    setVisible(!visible);
  }
  function handleMarkAsVisible(id) {
    api.put(`notifications/${id}`);
    setNotifications(
      notifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }
  const hasUnread = useMemo(
    () => !!notifications.find((notification) => notification.read === false),
    [notifications]
  );
  return (
    <Container>
      <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map((notification) => (
            <Notification key={notification._id} unread={!notification.read}>
              <p>{notification.content}</p>
              <time>{notification.timeDistance} </time>
              {!notification.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsVisible(notification._id)}
                >
                  Marcar com lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
