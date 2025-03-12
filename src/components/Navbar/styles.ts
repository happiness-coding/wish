// src/components/Navbar/styles.ts
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const NavbarContainer = styled.nav`
  background-color: white;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledNavLink = styled(NavLink)`
  color: #4a5568;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;

  &:hover {
    color: #4f46e5;
  }

  &.active {
    color: #4f46e5;

    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #4f46e5;
      border-radius: 1px;
    }
  }
`;
