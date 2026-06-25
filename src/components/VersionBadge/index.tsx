import type {ReactNode} from 'react';
import {useVersionData} from '@site/src/hooks/useVersionData';
import styles from './styles.module.css';

export default function VersionBadge(): ReactNode {
  const {data} = useVersionData();
  if (!data?.version) return null;
  return <span className={styles.badge}>Version: {data.version}</span>;
}
