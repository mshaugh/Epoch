import { AppShell, Container, Group, Header } from '@mantine/core';

import Brand from './Brand';
import ThemeSelector from './ThemeSelector';

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} px="md">
          <Group sx={{ height: '100% ' }} px={20} position="apart">
            <Brand />
            <ThemeSelector />
          </Group>
        </Header>
      }
    >
      <Container size="xs">{children}</Container>
    </AppShell>
  );
}
