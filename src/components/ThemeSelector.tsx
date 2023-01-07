import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core';
import { Sun, MoonStars } from 'tabler-icons-react';

export default function ThemeSelector() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Tooltip label={dark ? 'Light mode' : 'Dark mode'} position="bottom">
      <ActionIcon variant="outline" color={dark ? 'yellow' : 'blue'} onClick={() => toggleColorScheme()}>
        {dark ? <Sun size={16} /> : <MoonStars size={16} />}
      </ActionIcon>
    </Tooltip>
  );
}
