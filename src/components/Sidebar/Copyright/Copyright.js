import React from 'react';
import styles from './Copyright.module.scss';

const Copyright = ({ copyright, linkToHome = true }) => (
	<div className={styles['copyright']}>
		2020 © {linkToHome ? <a href="/">Leo's Blog</a> : `Leo's Blog`} - All rights reserved.
	</div>
);

export default Copyright;
