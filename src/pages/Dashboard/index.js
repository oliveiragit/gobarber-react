import React, { useMemo, useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import pt from 'date-fns/locale/pt-BR';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns';

import api from '../../services/api';

import { Container, Time } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const response = await api.get('schedule', {
          params: { date },
        });

        const data = range.map((hour) => {
          const checkDate = setMilliseconds(
            setSeconds(setMinutes(setHours(date, hour), 0), 0),
            0
          );
          return {
            time: `${hour}:00h`,
            past: isBefore(checkDate, new Date()),
            appointment: response.data.find((a) => {
              return isEqual(parseISO(a.date), checkDate);
            }),
          };
        });
        setSchedule(data);
      } catch (error) {
        setSchedule([]);
      }
    }
    loadSchedule();
  }, [date]);
  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }
  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#fff" />
        </button>
        <strong> {dateFormatted} </strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#fff" />
        </button>
      </header>

      <ul>
        {schedule.map((time) => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : 'Em aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
