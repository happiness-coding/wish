// src/components/Navbar/index.tsx.tsx
import { FC } from 'react';
import { NavbarContainer, NavLinks, StyledNavLink } from './styles';

export const Navbar: FC = () => {
  return (
    <NavbarContainer>
      <NavLinks>
        <StyledNavLink to="/tasks">Task List</StyledNavLink>
        <StyledNavLink to="/calendar">Calendar View</StyledNavLink>
      </NavLinks>
    </NavbarContainer>
  );
};
