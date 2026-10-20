import {useId, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type Cidr = {base: number; p: number; end: number; str: string};

function ipToLong(s: string): number | null {
  const parts = s.split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const o of parts) {
    if (!/^\d{1,3}$/.test(o) || +o > 255) return null;
    n = n * 256 + +o;
  }
  return n;
}

const longToIp = (n: number) =>
  [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.');
const size = (p: number) => Math.pow(2, 32 - p);
const netOf = (n: number, p: number) => Math.floor(n / size(p)) * size(p);
const overlaps = (a: Cidr, b: Cidr) => a.base <= b.end && b.base <= a.end;

// Returns the network, or the fixed network address when host bits are set, or null when invalid
function parseCidr(s: string): Cidr | string | null {
  const m = /^\s*([\d.]+)\/(\d{1,2})\s*$/.exec(s);
  if (!m) return null;
  const ip = ipToLong(m[1]);
  const p = +m[2];
  if (ip === null || p > 30) return null;
  const base = netOf(ip, p);
  const str = longToIp(base) + '/' + p;
  if (base !== ip) return str;
  return {base, p, end: base + size(p) - 1, str};
}

type Form = {a_real: string; a_map: string; b_real: string; b_map: string};

const EXAMPLE: Form = {a_real: '192.168.1.0/24', a_map: '10.1.1.0/24', b_real: '192.168.1.0/24', b_map: '10.2.2.0/24'};

function suggest(form: Form): Form {
  const a = parseCidr(form.a_real);
  const b = parseCidr(form.b_real);
  if (!a || !b || typeof a === 'string' || typeof b === 'string') return form;
  const taken: Cidr[] = [a, b];
  const pick = (p: number, seed: string) => {
    for (let n = netOf(ipToLong(seed)!, p); n + size(p) - 1 <= ipToLong('10.255.255.255')!; n += size(p)) {
      const c = {base: n, p, end: n + size(p) - 1, str: longToIp(n) + '/' + p};
      if (!taken.some((x) => overlaps(x, c))) {
        taken.push(c);
        return c.str;
      }
    }
    return '';
  };
  return {...form, a_map: pick(a.p, '10.1.1.0'), b_map: pick(b.p, '10.2.2.0')};
}

function CopyButton({value}: {value: string}): ReactNode {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };
  const label = copied
    ? translate({id: 'netmapPlanner.copied', message: 'Copied'})
    : translate({id: 'netmapPlanner.copy', message: 'Copy'});
  return (
    <button type="button" className={clsx(styles.copy, copied && styles.copied)} onClick={copy} aria-label={label} title={label}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        {copied ? <path d="M3 8.5L6.5 12L13 4.5" /> : <path d="M5.5 5.5V2.5H13.5V10.5H10.5M2.5 5.5H10.5V13.5H2.5Z" />}
      </svg>
    </button>
  );
}

// Mirrors the NethSecurity table: same tab, same columns in the same order, one row of values
function UiTable({tab, columns}: {tab?: string; columns: [string, string][]}): ReactNode {
  return (
    <div className={styles.uiTable}>
      {tab && <div className={styles.tab}>{tab}</div>}
      <table className={styles.grid}>
        <thead>
          <tr>
            {columns.map(([k]) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map(([k, v]) => (
              <td key={k} data-label={k}>
                <span>{v}</span>
                <CopyButton value={v} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Step({title, where, children}: {title: string; where?: string; children: ReactNode}): ReactNode {
  return (
    <div>
      <div className={styles.stepName}>{title}</div>
      {where && <div className={styles.where}>{where}</div>}
      {children}
    </div>
  );
}

function Packet({zone, className, rows}: {zone: string; className: string; rows: [string, string, string?][]}): ReactNode {
  return (
    <div className={clsx(styles.packet, className)}>
      <div className={styles.zone}>{zone}</div>
      {rows.map(([k, v, changed]) => (
        <div key={k} className={clsx(styles.packetRow, changed)}>
          <span className={styles.caption}>{k}</span>
          <code>{v}</code>
        </div>
      ))}
    </div>
  );
}

function Hop({rule, text}: {rule: string; text: string}): ReactNode {
  return (
    <div className={styles.hop}>
      <svg className={styles.arrow} viewBox="0 0 48 12" aria-hidden="true">
        <path d="M1 6H45M39 1.5L45 6L39 10.5" />
      </svg>
      <code>{rule}</code>
      <span>{text}</span>
    </div>
  );
}

function PacketPath({src, srcMapped, dst, dstMapped}: {src: string; srcMapped: string; dst: string; dstMapped: string}): ReactNode {
  const source = translate({id: 'netmapPlanner.path.source', message: 'Source'});
  const destination = translate({id: 'netmapPlanner.path.destination', message: 'Destination'});
  return (
    <div className={styles.path}>
      <Packet
        zone={translate({id: 'netmapPlanner.path.lanA', message: 'Leaves site A'})}
        className={styles.packetA}
        rows={[[source, src], [destination, dstMapped]]}
      />
      <Hop
        rule="NETMAP_SRC_A"
        text={translate({id: 'netmapPlanner.path.srcRule', message: 'Site A firewall rewrites the source'})}
      />
      <Packet
        zone={translate({id: 'netmapPlanner.path.tunnel', message: 'Through the VPN'})}
        className={styles.packetTunnel}
        rows={[[source, srcMapped, styles.changedA], [destination, dstMapped]]}
      />
      <Hop
        rule="NETMAP_DST_B"
        text={translate({id: 'netmapPlanner.path.dstRule', message: 'Site B firewall rewrites the destination'})}
      />
      <Packet
        zone={translate({id: 'netmapPlanner.path.lanB', message: 'Reaches site B'})}
        className={styles.packetB}
        rows={[[source, srcMapped], [destination, dst, styles.changedB]]}
      />
    </div>
  );
}

// Labels and menu path are the NethSecurity UI strings, translated as the UI translates them
function FirewallCard({site, siteB, mine, theirs}: {site: string; siteB: boolean; mine: [Cidr, Cidr]; theirs: Cidr}): ReactNode {
  const [real, map] = mine;
  const letter = siteB ? 'B' : 'A';
  const name = translate({id: 'netmapPlanner.ui.name', message: 'Name'});
  const sourceNetwork = translate({id: 'netmapPlanner.ui.sourceNetwork', message: 'Source network'});
  const destinationNetwork = translate({id: 'netmapPlanner.ui.destinationNetwork', message: 'Destination network'});
  const mappedNetwork = translate({id: 'netmapPlanner.ui.mappedNetwork', message: 'Mapped network'});
  return (
    <div className={clsx(styles.firewall, siteB && styles.firewallB)}>
      <h3>{site}</h3>
      <Step
        title={translate({id: 'netmapPlanner.step.tunnel', message: '1 · VPN tunnel'})}
        where={translate({id: 'netmapPlanner.step.tunnelWhere', message: 'Use the mapped networks, never the real ones.'})}>
        <UiTable
          columns={[
            [translate({id: 'netmapPlanner.tunnel.local', message: 'Local network'}), map.str],
            [translate({id: 'netmapPlanner.tunnel.remote', message: 'Remote network'}), theirs.str],
          ]}
        />
      </Step>
      <Step title={translate({id: 'netmapPlanner.step.source', message: '2 · Firewall › NAT › Rules and NETMAP › Add source NETMAP'})}>
        <UiTable
          tab={translate({id: 'netmapPlanner.ui.sourceNetmap', message: 'Source NETMAP'})}
          columns={[
            [name, 'NETMAP_SRC_' + letter],
            [destinationNetwork, theirs.str],
            [sourceNetwork, real.str],
            [mappedNetwork, map.str],
          ]}
        />
      </Step>
      <Step
        title={translate({id: 'netmapPlanner.step.destination', message: '3 · Firewall › NAT › Rules and NETMAP › Add destination NETMAP'})}>
        <UiTable
          tab={translate({id: 'netmapPlanner.ui.destinationNetmap', message: 'Destination NETMAP'})}
          columns={[
            [name, 'NETMAP_DST_' + letter],
            [sourceNetwork, theirs.str],
            [destinationNetwork, map.str],
            [mappedNetwork, real.str],
          ]}
        />
      </Step>
    </div>
  );
}

export default function NetmapPlanner(): ReactNode {
  const [form, setForm] = useState<Form>(EXAMPLE);

  const siteA = translate({id: 'netmapPlanner.siteA', message: 'Site A'});
  const siteB = translate({id: 'netmapPlanner.siteB', message: 'Site B'});
  const realLabel = translate({id: 'netmapPlanner.input.real', message: 'Real network (LAN)'});
  const mapLabel = translate({id: 'netmapPlanner.input.mapped', message: 'Mapped network'});

  const id = useId();
  const problems: {text: string; field?: keyof Form}[] = [];
  const check = (k: keyof Form, label: string): Cidr | null => {
    const c = parseCidr(form[k]);
    if (c && typeof c !== 'string') return c;
    let error;
    if (!form[k].trim()) {
      error = translate({id: 'netmapPlanner.error.required', message: 'required'});
    } else if (typeof c === 'string') {
      error = translate({id: 'netmapPlanner.error.hostBits', message: 'use the network address: {n}'}, {n: c});
    } else {
      error = translate({id: 'netmapPlanner.error.cidr', message: 'not a valid network: write it as 192.168.1.0/24'});
    }
    problems.push({text: label + ': ' + error, field: k});
    return null;
  };
  const aReal = check('a_real', siteA + ' · ' + realLabel);
  const aMap = check('a_map', siteA + ' · ' + mapLabel);
  const bReal = check('b_real', siteB + ' · ' + realLabel);
  const bMap = check('b_map', siteB + ' · ' + mapLabel);
  if ((aReal && aMap && aReal.p !== aMap.p) || (bReal && bMap && bReal.p !== bMap.p)) {
    problems.push({
      text: translate({id: 'netmapPlanner.error.size', message: 'Each mapped network must have the same prefix as its real network.'}),
    });
  }
  if (
    aReal && aMap && bReal && bMap &&
    (overlaps(aMap, aReal) || overlaps(aMap, bReal) || overlaps(aMap, bMap) || overlaps(bMap, aReal) || overlaps(bMap, bReal))
  ) {
    problems.push({
      text: translate({
        id: 'netmapPlanner.error.overlap',
        message: 'The mapped networks must not overlap each other or either real network.',
      }),
    });
  }

  const input = (k: keyof Form, label: string, placeholder: string) => {
    const invalid = problems.some((p) => p.field === k);
    return (
      <label>
        <span className={styles.caption}>{label}</span>
        <input
          type="text"
          spellCheck={false}
          placeholder={placeholder}
          value={form[k]}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-${k}` : undefined}
          onChange={(e) => setForm({...form, [k]: e.target.value})}
        />
      </label>
    );
  };

  let config: ReactNode = null;
  if (!problems.length && aReal && aMap && bReal && bMap) {
    // example hosts: .10 in A and .20 in B, or the last usable host in small networks
    const hA = Math.min(10, size(aReal.p) - 2);
    const hB = Math.min(20, size(bReal.p) - 2);
    const hosts = {ha: longToIp(aReal.base + hA), hb: longToIp(bReal.base + hB)};
    config = (
      <>
        <h2 className={styles.sectionTitle}>
          {translate({id: 'netmapPlanner.path.title', message: 'How a packet from site A reaches site B'})}
        </h2>
        <PacketPath
          src={hosts.ha}
          srcMapped={longToIp(aMap.base + hA)}
          dst={hosts.hb}
          dstMapped={longToIp(bMap.base + hB)}
        />
        <h2 className={styles.sectionTitle}>{translate({id: 'netmapPlanner.config.title', message: 'Configuration'})}</h2>
        <div className={styles.configs}>
          <FirewallCard site={siteA} siteB={false} mine={[aReal, aMap]} theirs={bMap} />
          <FirewallCard site={siteB} siteB mine={[bReal, bMap]} theirs={aMap} />
        </div>
        <div className={styles.check}>
          <h3>{translate({id: 'netmapPlanner.check.title', message: 'Test, with two example hosts'})}</h3>
          <p>
            {translate({id: 'netmapPlanner.check.ab', message: 'From {ha} (site A), to reach {hb} (site B):'}, hosts)}{' '}
            <code>ping {longToIp(bMap.base + hB)}</code>
          </p>
          <p>
            {translate({id: 'netmapPlanner.check.ba', message: 'From {hb} (site B), to reach {ha} (site A):'}, hosts)}{' '}
            <code>ping {longToIp(aMap.base + hA)}</code>
          </p>
          <p className={styles.where}>
            {translate(
              {
                id: 'netmapPlanner.check.seenAs',
                message: 'On the other side the connection comes from {x}: use that address in firewall rules and logs.',
              },
              {x: longToIp(aMap.base + hA)},
            )}
          </p>
        </div>
        <div className={styles.notes}>
          <div className={styles.stepName}>{translate({id: 'netmapPlanner.notes.title', message: 'Good to know'})}</div>
          <p>
            {translate({
              id: 'netmapPlanner.notes.rules',
              message: "Firewall rules between the two sites use the other site's mapped network.",
            })}
          </p>
          <p>
            {translate({
              id: 'netmapPlanner.notes.unused',
              message: 'The mapped networks must not exist at either site or in any other VPN.',
            })}
          </p>
          <p>
            {translate({
              id: 'netmapPlanner.notes.dns',
              message: 'If a DNS name of the other site resolves to its real IP it will not work: use the mapped address.',
            })}
          </p>
        </div>
      </>
    );
  }

  return (
    <div className={styles.planner}>
      <div>
        <div className={styles.sites}>
          <div className={styles.site}>
            <h3>{siteA}</h3>
            {input('a_real', realLabel, '192.168.1.0/24')}
            {input('a_map', mapLabel, '10.1.1.0/24')}
          </div>
          <div className={clsx(styles.site, styles.siteB)}>
            <h3>{siteB}</h3>
            {input('b_real', realLabel, '192.168.1.0/24')}
            {input('b_map', mapLabel, '10.2.2.0/24')}
          </div>
        </div>
        {/* live region stays mounted so screen readers announce new problems */}
        <div aria-live="polite">
          {problems.length > 0 && (
            <ul className={styles.problems}>
              {problems.map((p) => (
                <li key={p.text} id={p.field && `${id}-${p.field}`}>
                  {p.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.bar}>
        <button type="button" className={styles.action} onClick={() => setForm(suggest(form))}>
          {translate({id: 'netmapPlanner.action.suggest', message: 'Suggest mapped networks'})}
        </button>
        <button type="button" className={styles.action} onClick={() => setForm(EXAMPLE)}>
          {translate({id: 'netmapPlanner.action.example', message: 'Reload the example'})}
        </button>
      </div>
      {config && <div>{config}</div>}
    </div>
  );
}
