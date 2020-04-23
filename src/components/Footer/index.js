// @flow strict
import React from 'react';
import styles from './Footer.module.scss';
import Contacts from '../Sidebar/Contacts';
import Copyright from '../Sidebar/Copyright';
import { useSiteMetadata } from '../../hooks';

const Footer = () => {
  const { author: { contacts }, copyright } = useSiteMetadata();

  return <div className={styles['footer']}>
    <p className={styles['reachout']}>Find me on your favorite social network ✌️</p>
    <Contacts contacts={contacts} />
    <Copyright copyright={copyright} />
  </div>
};

export default Footer;
