import {useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type Block = {name: string; pri: string; sec: string; vip: string; pfx: string};
type Lan = Block & {id: number};
type Vip = {id: number; iface: string; vip: string; pfx: string};
type Problem = {text: string; field?: string};
type Checked = {problems: Problem[]; base?: number; end?: number; net?: string};

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
const validPrefix = (s: string) => /^\d{1,2}$/.test(s) && +s >= 8 && +s <= 30;

const PASSWORD = 'backup_root_password';

const EXAMPLE: Block = {name: 'lan', pri: '192.168.100.238', sec: '192.168.100.239', vip: '192.168.100.240', pfx: '24'};

let nextId = 0;

function CopyButton({value}: {value: string}): ReactNode {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };
  const label = copied
    ? translate({id: 'haPlanner.copied', message: 'Copied'})
    : translate({id: 'haPlanner.copy', message: 'Copy'});
  return (
    <button type="button" className={clsx(styles.copy, copied && styles.copied)} onClick={copy} aria-label={label} title={label}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        {copied ? <path d="M3 8.5L6.5 12L13 4.5" /> : <path d="M5.5 5.5V2.5H13.5V10.5H10.5M2.5 5.5H10.5V13.5H2.5Z" />}
      </svg>
    </button>
  );
}

function Field({
  label,
  value,
  placeholder,
  invalid,
  number,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  invalid: boolean;
  number?: boolean;
  onChange: (v: string) => void;
}): ReactNode {
  return (
    <label>
      <span className={styles.caption}>{label}</span>
      <input
        type={number ? 'number' : 'text'}
        min={number ? 8 : undefined}
        max={number ? 30 : undefined}
        inputMode={number ? 'numeric' : undefined}
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        aria-invalid={invalid}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Problems({problems}: {problems: Problem[]}): ReactNode {
  // live region stays mounted so screen readers announce new problems
  return (
    <div aria-live="polite">
      {problems.length > 0 && (
        <ul className={styles.problems}>
          {problems.map((p) => (
            <li key={p.text}>{p.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HaPlanner(): ReactNode {
  const [ha, setHa] = useState<Block>(EXAMPLE);
  const [lans, setLans] = useState<Lan[]>([]);
  const [vips, setVips] = useState<Vip[]>([]);
  const [nonInteractive, setNonInteractive] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const nameLabel = translate({id: 'haPlanner.field.name', message: 'Interface name'});
  const priLabel = translate({id: 'haPlanner.field.primary', message: 'Primary node IP'});
  const secLabel = translate({id: 'haPlanner.field.secondary', message: 'Secondary node IP'});
  const vipLabel = translate({id: 'haPlanner.field.vip', message: 'Virtual IP'});
  const pfxLabel = translate({id: 'haPlanner.field.prefix', message: 'Prefix'});
  const ifaceLabel = translate({id: 'haPlanner.field.iface', message: 'Cluster interface'});
  const required = translate({id: 'haPlanner.error.required', message: 'required'});
  const prefixError = translate({id: 'haPlanner.error.prefix', message: 'the prefix must be between 8 and 30'});

  // The network comes from the primary node IP and the prefix
  const checkBlock = (b: Block): Checked => {
    const problems: Problem[] = [];
    const fields: [keyof Block, string][] = [
      ['name', nameLabel],
      ['pri', priLabel],
      ['sec', secLabel],
      ['vip', vipLabel],
    ];
    for (const [k, label] of fields) {
      if (!b[k].trim()) problems.push({text: `${label}: ${required}`, field: k});
    }
    if (!validPrefix(b.pfx.trim())) problems.push({text: `${pfxLabel}: ${prefixError}`, field: 'pfx'});
    if (problems.length) return {problems};

    const ips: Record<string, number> = {};
    for (const [k, label] of fields.slice(1)) {
      const n = ipToLong(b[k].trim());
      if (n === null) {
        problems.push({
          text: `${label}: ` + translate({id: 'haPlanner.error.ip', message: '"{ip}" is not a valid IPv4 address'}, {ip: b[k].trim()}),
          field: k,
        });
      } else {
        ips[k] = n;
      }
    }
    if (problems.length) return {problems};

    const p = +b.pfx.trim();
    const base = netOf(ips.pri, p);
    const end = base + size(p) - 1;
    const net = longToIp(base) + '/' + p;
    for (const [k, label] of fields.slice(2)) {
      if (ips[k] < base || ips[k] > end) {
        problems.push({
          text:
            `${label}: ` +
            translate(
              {id: 'haPlanner.error.notSame', message: '{ip} is not in the same network as the primary node ({net})'},
              {ip: b[k].trim(), net},
            ),
          field: k,
        });
      }
    }
    for (const [k, label] of fields.slice(1)) {
      if (ips[k] === base || ips[k] === end) {
        problems.push({
          text:
            `${label}: ` +
            translate({id: 'haPlanner.error.edge', message: '{ip} is the network or the broadcast address'}, {ip: b[k].trim()}),
          field: k,
        });
      }
    }
    if (ips.pri === ips.sec || ips.pri === ips.vip || ips.sec === ips.vip) {
      problems.push({text: translate({id: 'haPlanner.error.same', message: 'The three addresses must differ from each other.'})});
    }
    return {problems, base, end, net};
  };

  const lanTouched = (l: Lan) => !!(l.name.trim() || l.pri.trim() || l.sec.trim() || l.vip.trim());
  const haTouched = !!(ha.pri.trim() || ha.sec.trim() || ha.vip.trim());

  const results: Record<string, Checked> = {ha: checkBlock(ha)};
  for (const l of lans) results[l.id] = checkBlock(l);

  const blocks: {key: string; name: string}[] = [{key: 'ha', name: ha.name.trim()}].concat(
    lans.map((l) => ({key: String(l.id), name: l.name.trim()})),
  );
  for (const l of lans) {
    if (l.name.trim().toLowerCase() === 'lan') {
      results[l.id].problems.push({
        text: `${nameLabel}: ` + translate({id: 'haPlanner.error.lanName', message: 'only the HA interface can be named lan'}),
        field: 'name',
      });
    }
  }
  const seen = new Set<string>();
  for (const b of blocks) {
    const n = b.name.toLowerCase();
    if (!n) continue;
    if (seen.has(n) && !(b.key !== 'ha' && n === 'lan')) {
      results[b.key].problems.push({
        text:
          `${nameLabel}: ` +
          translate({id: 'haPlanner.error.duplicate', message: '"{name}" is already used by another interface'}, {name: b.name}),
        field: 'name',
      });
    }
    seen.add(n);
  }
  const ranged = blocks.filter((b) => results[b.key].base !== undefined);
  for (let i = 0; i < ranged.length; i++) {
    for (let j = i + 1; j < ranged.length; j++) {
      const a = results[ranged[i].key];
      const b = results[ranged[j].key];
      if (a.base! <= b.end! && b.base! <= a.end!) {
        b.problems.push({
          text: translate(
            {id: 'haPlanner.error.overlap', message: 'The network {net} overlaps with {name}.'},
            {net: b.net!, name: ranged[i].name},
          ),
        });
      }
    }
  }

  const declared = new Set(blocks.map((b) => b.name.toLowerCase()).filter(Boolean));
  const usable = new Set(
    blocks.filter((b) => !results[b.key].problems.length).map((b) => b.name.toLowerCase()).filter(Boolean),
  );
  const vipResults: Record<number, {problems: Problem[]; emit: boolean}> = {};
  for (const v of vips) {
    const problems: Problem[] = [];
    const iface = v.iface.trim();
    if (!iface) {
      problems.push({text: `${ifaceLabel}: ${required}`, field: 'iface'});
    } else if (!declared.has(iface.toLowerCase())) {
      problems.push({
        text:
          `${ifaceLabel}: ` +
          translate(
            {
              id: 'haPlanner.error.vipUnknown',
              message:
                '"{name}" is not a cluster interface, the command will be refused. For extra addresses on a WAN, add aliases to the WAN of the primary node: they are replicated automatically',
            },
            {name: iface},
          ),
        field: 'iface',
      });
    } else if (!usable.has(iface.toLowerCase())) {
      problems.push({
        text:
          `${ifaceLabel}: ` +
          translate({id: 'haPlanner.error.vipBroken', message: '"{name}" has errors, fix them first'}, {name: iface}),
        field: 'iface',
      });
    }
    let addressOk = true;
    if (!v.vip.trim()) {
      problems.push({text: `${vipLabel}: ${required}`, field: 'vip'});
      addressOk = false;
    } else if (ipToLong(v.vip.trim()) === null) {
      problems.push({
        text: `${vipLabel}: ` + translate({id: 'haPlanner.error.ip', message: '"{ip}" is not a valid IPv4 address'}, {ip: v.vip.trim()}),
        field: 'vip',
      });
      addressOk = false;
    }
    if (!validPrefix(v.pfx.trim())) {
      problems.push({text: `${pfxLabel}: ${prefixError}`, field: 'pfx'});
      addressOk = false;
    }
    vipResults[v.id] = {problems, emit: addressOk && !!iface};
  }

  // Errors on the HA interface or on a filled-in LAN stop the commands, VIP findings only warn
  const blocked = results.ha.problems.length > 0 || lans.some((l) => lanTouched(l) && results[l.id].problems.length > 0);

  const lines: {text: string; kind: 'step' | 'note' | 'warn' | 'cmd'}[] = [];
  if (haTouched && !blocked) {
    const name = ha.name.trim();
    const withPassword = (c: string) => (nonInteractive ? `echo "${PASSWORD}" | ${c}` : c);
    let n = 0;
    const step = (text: string) => lines.push({text: `${++n}. ${text}`, kind: 'step'});
    const note = (text: string) => lines.push({text, kind: 'note'});
    const cmd = (text: string) => lines.push({text, kind: 'cmd'});

    const flagged = vips.filter((v) => vipResults[v.id].emit && vipResults[v.id].problems.length);
    if (flagged.length) {
      lines.push({
        text: translate(
          {id: 'haPlanner.cmd.vipWarning', message: 'Warning, check these virtual IPs before running their commands: {list}'},
          {list: flagged.map((v) => `${v.iface.trim()} ${v.vip.trim()}`).join(', ')},
        ),
        kind: 'warn',
      });
    }

    step(translate({id: 'haPlanner.cmd.check', message: 'Check the requirements, from the primary node'}));
    note(
      translate({
        id: 'haPlanner.cmd.checkNote',
        message: 'first: static IPs set on both nodes, cables connected on every cluster interface',
      }),
    );
    cmd(`ns-ha-config check-primary-node ${name}`);
    note(
      nonInteractive
        ? translate(
            {id: 'haPlanner.cmd.passwordReplace', message: 'replace {password} with the root password of the secondary node'},
            {password: PASSWORD},
          )
        : translate({id: 'haPlanner.cmd.passwordPrompt', message: 'the root password of the secondary node is asked and not shown'}),
    );
    cmd(withPassword(`ns-ha-config check-backup-node ${ha.sec.trim()} ${name}`));

    step(translate({id: 'haPlanner.cmd.init', message: 'Initialize the cluster, again from the primary node'}));
    cmd(`ns-ha-config init-primary-node ${ha.pri.trim()} ${ha.sec.trim()} ${ha.vip.trim()}/${ha.pfx.trim()} ${name}`);
    cmd(withPassword(`ns-ha-config init-backup-node ${name}`));

    const okLans = lans.filter(lanTouched);
    if (okLans.length) {
      step(translate({id: 'haPlanner.cmd.lans', message: 'Add the additional LAN interfaces'}));
      okLans.forEach((l) => cmd(`ns-ha-config add-lan-interface ${l.pri.trim()} ${l.sec.trim()} ${l.vip.trim()}/${l.pfx.trim()}`));
    }
    const okVips = vips.filter((v) => vipResults[v.id].emit);
    if (okVips.length) {
      step(translate({id: 'haPlanner.cmd.vips', message: 'Add the extra virtual IPs'}));
      okVips.forEach((v) => cmd(`ns-ha-config add-vip ${v.iface.trim()} ${v.vip.trim()}/${v.pfx.trim()}`));
    }

    step(translate({id: 'haPlanner.cmd.sync', message: 'Sync the secondary node right away'}));
    cmd('/usr/libexec/ns-rsync.sh');

    step(translate({id: 'haPlanner.cmd.status', message: 'Check the result'}));
    note(translate({id: 'haPlanner.cmd.statusNote', message: 'Last Sync Status must be Successful'}));
    cmd('ns-ha-config status');
  }

  const plain = lines
    .map((l, i) => {
      const text = l.kind === 'cmd' ? l.text : '# ' + l.text;
      return l.kind === 'step' && i > 0 ? '\n' + text : text;
    })
    .join('\n');

  const copyAll = async () => {
    await navigator.clipboard.writeText(plain);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1300);
  };

  const invalid = (problems: Problem[], field: string) => problems.some((p) => p.field === field);

  const blockFields = (b: Block, problems: Problem[], set: (b: Block) => void, placeholders: Block) => (
    <div className={styles.fields}>
      <Field label={nameLabel} value={b.name} placeholder={placeholders.name} invalid={invalid(problems, 'name')} onChange={(v) => set({...b, name: v})} />
      <Field label={priLabel} value={b.pri} placeholder={placeholders.pri} invalid={invalid(problems, 'pri')} onChange={(v) => set({...b, pri: v})} />
      <Field label={secLabel} value={b.sec} placeholder={placeholders.sec} invalid={invalid(problems, 'sec')} onChange={(v) => set({...b, sec: v})} />
      <Field label={vipLabel} value={b.vip} placeholder={placeholders.vip} invalid={invalid(problems, 'vip')} onChange={(v) => set({...b, vip: v})} />
      <Field label={pfxLabel} value={b.pfx} placeholder="24" invalid={invalid(problems, 'pfx')} number onChange={(v) => set({...b, pfx: v})} />
    </div>
  );

  const remove = translate({id: 'haPlanner.action.remove', message: 'Remove'});

  return (
    <div className={styles.planner}>
      <section className={styles.part}>
        <h2 className={styles.sectionTitle}>{translate({id: 'haPlanner.configure.title', message: 'Configure'})}</h2>
        <div className={clsx(styles.card, styles.haCard)}>
          <div className={styles.cardHead}>
            <h3>{translate({id: 'haPlanner.ha.title', message: 'HA interface'})}</h3>
            <button
              type="button"
              className={styles.link}
              onClick={() => {
                setHa(EXAMPLE);
                setLans([]);
                setVips([]);
              }}>
              {translate({id: 'haPlanner.action.example', message: 'Reload the example'})}
            </button>
          </div>
          <p className={styles.lead}>
            {translate({
              id: 'haPlanner.ha.lead',
              message: 'One per cluster, this is where VRRP runs. Three addresses in the same network: both nodes and the virtual IP that follows the active one.',
            })}
          </p>
          {blockFields(ha, results.ha.problems, setHa, EXAMPLE)}
          <Problems problems={results.ha.problems} />
        </div>

        <div className={styles.optional}>
          <div>
            <h3>{translate({id: 'haPlanner.lans.title', message: 'Additional LAN interfaces'})}</h3>
            <p className={styles.lead}>
              {translate({
                id: 'haPlanner.lans.lead',
                message: 'Optional. DMZ, guest or other non-WAN networks of the cluster, with the same three-address logic.',
              })}
            </p>
            <div className={styles.stack}>
              {lans.map((l, i) => {
                const problems = lanTouched(l) ? results[l.id].problems : [];
                return (
                  <div key={l.id} className={styles.card}>
                    <div className={clsx(styles.cardHead, styles.ruled)}>
                      <h4>LAN {i + 1}</h4>
                      <button type="button" className={styles.remove} onClick={() => setLans(lans.filter((x) => x.id !== l.id))}>
                        {remove}
                      </button>
                    </div>
                    {blockFields(l, problems, (b) => setLans(lans.map((x) => (x.id === l.id ? {...b, id: l.id} : x))), {
                      name: 'dmz',
                      pri: '192.168.200.1',
                      sec: '192.168.200.2',
                      vip: '192.168.200.254',
                      pfx: '24',
                    })}
                    <Problems problems={problems} />
                  </div>
                );
              })}
              <div className={styles.bar}>
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => setLans([...lans, {id: ++nextId, name: '', pri: '', sec: '', vip: '', pfx: '24'}])}>
                  {translate({id: 'haPlanner.action.addLan', message: 'Add a LAN interface'})}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3>{translate({id: 'haPlanner.vips.title', message: 'Extra virtual IPs'})}</h3>
            <p className={styles.lead}>
              {translate({
                id: 'haPlanner.vips.lead',
                message: 'Optional. One more virtual IP on an interface already in the cluster. Not needed on WANs: their aliases are replicated automatically.',
              })}
            </p>
            <div className={styles.stack}>
              {vips.map((v, i) => {
                const problems = v.iface.trim() || v.vip.trim() ? vipResults[v.id].problems : [];
                const set = (changed: Partial<Vip>) => setVips(vips.map((x) => (x.id === v.id ? {...x, ...changed} : x)));
                return (
                  <div key={v.id} className={styles.card}>
                    <div className={clsx(styles.cardHead, styles.ruled)}>
                      <h4>VIP {i + 1}</h4>
                      <button type="button" className={styles.remove} onClick={() => setVips(vips.filter((x) => x.id !== v.id))}>
                        {remove}
                      </button>
                    </div>
                    <div className={styles.fields}>
                      <Field label={ifaceLabel} value={v.iface} placeholder="lan2" invalid={invalid(problems, 'iface')} onChange={(x) => set({iface: x})} />
                      <Field label={vipLabel} value={v.vip} placeholder="192.168.122.66" invalid={invalid(problems, 'vip')} onChange={(x) => set({vip: x})} />
                      <Field label={pfxLabel} value={v.pfx} placeholder="24" invalid={invalid(problems, 'pfx')} number onChange={(x) => set({pfx: x})} />
                    </div>
                    <Problems problems={problems} />
                  </div>
                );
              })}
              <div className={styles.bar}>
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => setVips([...vips, {id: ++nextId, iface: '', vip: '', pfx: '24'}])}>
                  {translate({id: 'haPlanner.action.addVip', message: 'Add a virtual IP'})}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={clsx(styles.part, styles.output)}>
        <div className={styles.commandsHead}>
          <div>
            <h2 className={styles.sectionTitle}>{translate({id: 'haPlanner.commands.title', message: 'Commands'})}</h2>
            <p className={styles.where}>
              {translate({id: 'haPlanner.commands.where', message: 'Run them on the primary node, from the console or over SSH.'})}
            </p>
          </div>
          <div className={styles.bar}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={nonInteractive} onChange={(e) => setNonInteractive(e.target.checked)} />
              {translate({id: 'haPlanner.commands.nonInteractive', message: 'Non-interactive commands'})}
            </label>
            <button type="button" className={styles.action} disabled={!lines.length} onClick={copyAll}>
              {copiedAll
                ? translate({id: 'haPlanner.copied', message: 'Copied'})
                : translate({id: 'haPlanner.action.copyAll', message: 'Copy all'})}
            </button>
          </div>
        </div>
        <div className={styles.terminal} aria-live="polite">
          {!haTouched && (
            <div className={styles.comment}>
              # {translate({id: 'haPlanner.commands.empty', message: 'Fill in the HA interface: the commands appear here.'})}
            </div>
          )}
          {haTouched && blocked && (
            <div className={styles.warn}>
              # {translate({id: 'haPlanner.commands.blocked', message: 'No commands generated: fix the errors above.'})}
            </div>
          )}
          {lines.map((l, i) =>
            l.kind === 'cmd' ? (
              <div key={i} className={styles.cmd}>
                <code>
                  {l.text.split(PASSWORD).map((part, j) => (
                    <span key={j}>
                      {j > 0 && <mark>{PASSWORD}</mark>}
                      {part}
                    </span>
                  ))}
                </code>
                <CopyButton value={l.text} />
              </div>
            ) : (
              <div key={i} className={clsx(styles.comment, l.kind === 'step' && styles.step, l.kind === 'warn' && styles.warn)}>
                # {l.text}
              </div>
            ),
          )}
        </div>

        {lines.length > 0 && (
          <div className={styles.notes}>
            <div className={styles.stepName}>{translate({id: 'haPlanner.notes.title', message: 'After the initialization'})}</div>
            <ul>
              <li>
                {translate({
                  id: 'haPlanner.notes.wait',
                  message: 'Wait at least 10 minutes before testing a failover: the configuration syncs at that interval.',
                })}
              </li>
              <li>
                {translate({
                  id: 'haPlanner.notes.wan',
                  message: 'Configure the WAN interfaces only on the primary node, from the web interface: they are replicated automatically.',
                })}
              </li>
              <li>
                {translate({
                  id: 'haPlanner.notes.clients',
                  message: "Clients must use the virtual IP as gateway and DNS, never a single node's address.",
                })}
              </li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
