import type {ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.features.utm.title',
      message: 'Unified Threat Management',
      description: 'Title of the first homepage feature card',
    }),
    Svg: require('@site/static/img/easy.svg').default,
    description: translate({
      id: 'homepage.features.utm.description',
      message:
        'Firewall, multi-WAN, content filtering, deep packet inspection, intrusion prevention and VPN in a single integrated solution.',
      description: 'Description of the first homepage feature card',
    }),
  },
  {
    title: translate({
      id: 'homepage.features.webui.title',
      message: 'Modern web interface',
      description: 'Title of the second homepage feature card',
    }),
    Svg: require('@site/static/img/cluster.svg').default,
    description: translate({
      id: 'homepage.features.webui.description',
      message:
        'Configure and monitor every service through a clean web interface, with an optional remote controller to manage multiple firewalls.',
      description: 'Description of the second homepage feature card',
    }),
  },
  {
    title: translate({
      id: 'homepage.features.opensource.title',
      message: 'Open Source',
      description: 'Title of the third homepage feature card',
    }),
    Svg: require('@site/static/img/open_source.svg').default,
    description: translate({
      id: 'homepage.features.opensource.description',
      message: 'Built on OpenWrt and backed by the vibrant NethServer community.',
      description: 'Description of the third homepage feature card',
    }),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
