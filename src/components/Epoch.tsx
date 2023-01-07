import { useEffect, useState } from 'react';

import { Divider, NumberInput, Select, TextInput } from '@mantine/core';
import { useInputState, useLocalStorage } from '@mantine/hooks';

import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import ct from 'countries-and-timezones';

import { ChevronDown, Search } from 'tabler-icons-react';

import CopyButton from './CopyButton';
import DateTimePicker from './DateTimePicker';

dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Timezone = {
  value: string;
  label: string;
  group: string;
};

const timezones: Timezone[] = Object.values(ct.getAllTimezones())
  .map((tz) => {
    const [area, ...location] = tz.name.split('/');
    if (location.length) {
      return {
        value: tz.name,
        label: location.join(', ').replaceAll('_', ' '),
        group: area.replaceAll('_', ' '),
      };
    }
  })
  .filter((tz): tz is Timezone => tz !== undefined);

const datetimeFormats: {
  [style: string]: {
    options?: Intl.DateTimeFormatOptions;
    format?: (epoch: Dayjs) => string;
  };
} = {
  t: {
    options: { hour: '2-digit', minute: '2-digit' },
  },
  T: {
    options: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  },
  d: {
    options: { year: 'numeric', month: '2-digit', day: '2-digit' },
  },
  D: {
    options: { year: 'numeric', month: 'long', day: '2-digit' },
  },
  f: {
    options: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  F: {
    options: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  R: {
    format: (epoch) => epoch.fromNow(),
  },
};

const datetimeFormat = (style: string, epoch: Dayjs, tz?: string) => {
  const dtf = datetimeFormats[style];

  return dtf.format
    ? dtf.format(epoch)
    : new Intl.DateTimeFormat([], { timeZone: tz, ...dtf.options }).format(epoch.toDate());
};

const styles: { value: string; label: string; group: string }[] = [
  { value: 't', label: 'Short Time', group: 'Time' },
  { value: 'T', label: 'Long Time', group: 'Time' },
  { value: 'd', label: 'Short Date', group: 'Date' },
  { value: 'D', label: 'Long Date', group: 'Date' },
  { value: 'f', label: 'Short Date/Time', group: 'Date/Time' },
  { value: 'F', label: 'Long Date/Time', group: 'Date/Time' },
  { value: 'R', label: 'Relative Time', group: 'Misc' },
];

export default function Epoch() {
  const [epoch, setEpoch] = useState<Dayjs>(dayjs());
  const [timezone, setTimezone] = useLocalStorage<string>({
    key: 'timezone',
    defaultValue: dayjs.tz.guess(),
  });
  const [date, setDate] = useInputState<Date>(epoch.toDate());
  const [time, setTime] = useInputState<Date>(epoch.toDate());

  useEffect(() => {
    if (timezone && date && time) {
      setEpoch(dayjs(date).hour(time.getHours()).minute(time.getMinutes()).second(0).tz(timezone, true));
    }
  }, [timezone, date, time]);

  const [discordStyle, setDiscordStyle] = useInputState<string>('f');

  return (
    <form>
      <Select
        label="Timezone"
        required
        searchable
        nothingFound="Nothing found"
        value={timezone}
        onChange={(value: string) => setTimezone(value)}
        data={timezones}
        rightSection={<Search size={16} />}
        styles={{ rightSection: { pointerEvents: 'none' } }}
        mb="md"
      />

      <DateTimePicker date={date} setDate={setDate} time={time} setTime={setTime} />

      <NumberInput
        label="Epoch"
        value={epoch.unix()}
        readOnly={true}
        hideControls={true}
        rightSection={<CopyButton data={`${epoch.unix()}`} />}
        rightSectionWidth={36}
        mt="md"
      />

      <Divider mt="xl" mb="md" />

      <Select
        label="Discord Style"
        required
        value={discordStyle}
        onChange={setDiscordStyle}
        data={styles}
        maxDropdownHeight={500}
        rightSection={<ChevronDown size={16} />}
        styles={{ rightSection: { pointerEvents: 'none' } }}
      />

      <TextInput
        label="Discord"
        value={`<t:${epoch.unix()}:${discordStyle}>`}
        readOnly={true}
        rightSection={<CopyButton data={`<t:${epoch.unix()}:${discordStyle}>`} />}
        mt="md"
      />

      <TextInput
        label={`Rendered Output (${timezone})`}
        value={`${datetimeFormat(discordStyle, epoch, timezone)}`}
        readOnly={true}
        mt="md"
      />

      {timezone && timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone && (
        <TextInput
          label={`Rendered Output (${Intl.DateTimeFormat().resolvedOptions().timeZone})`}
          value={`${datetimeFormat(discordStyle, epoch)}`}
          readOnly={true}
          mt="md"
        />
      )}
    </form>
  );
}
