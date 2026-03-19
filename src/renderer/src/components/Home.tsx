import React, { useState, useEffect, useRef } from 'react'

// ==================== TYPES ====================

interface CPUInfo {
  manufacturer: string
  brand: string
  speed: number
  cores: number
  physicalCores: number
  usage: number
  temperature: number
  load: number
  cache: any
}

interface MemoryInfo {
  total: number
  free: number
  used: number
  active: number
  available: number
  buffcache: number
  swaptotal: number
  swapused: number
  percent: number
}

interface DiskInfo {
  fs: string
  size: number
  used: number
  available: number
  use: number
  mount: string
}

interface OSInfo {
  platform: string
  distro: string
  release: string
  kernel: string
  arch: string
  hostname: string
  uptime: number
  build: string
  users: number
  loadavg: number[]
}

interface NetworkInfo {
  iface: string
  ip4: string
  ip6?: string
  mac: string
  speed: number
  operstate: string
  type: string
  ssid?: string
  signal?: number
  channel?: number
  frequency?: number
}

interface BluetoothInfo {
  available: boolean
  enabled: boolean
  devices: Array<{ name: string; address: string; connected: boolean; battery?: number; type?: string }>
  adapter?: {
    name: string
    version: string
    mac: string
  }
}

interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  mem: number
  threads?: number
  priority?: string
}

interface BatteryInfo {
  hasBattery: boolean
  percent: number
  discharging: boolean
  timeRemaining: number
  timeToFull: number
  voltage: number
  temperature: number
  dischargeRate: number
}

interface FullSystemInfo {
  cpu: CPUInfo
  memory: MemoryInfo
  disk: DiskInfo[]
  os: OSInfo
  network: NetworkInfo[]
  bluetooth: BluetoothInfo
  processes: ProcessInfo[]
  battery: BatteryInfo
  node: {
    pid: number
    memory: NodeJS.MemoryUsage
    version: string
  }
}

interface BlockchainNode {
  id: string
  name: string
  status: 'active' | 'syncing' | 'validating' | 'mining'
  blocks: number
  peers: number
  hash: string
  lastBlock: string
  transactions: number
  latency: number
  stake: number
  version: string
}

interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  fee: number
  timestamp: Date
  status: 'pending' | 'confirmed' | 'finalized'
  hash: string
  block?: number
  confirmations: number
}

interface Block {
  height: number
  hash: string
  timestamp: Date
  transactions: number
  size: number
  miner: string
  difficulty: number
}

// ==================== COMPONENT ====================

export default function Home() {
  // ==================== STATE ====================
  
  const [sys, setSys] = useState<FullSystemInfo | null>(null)
  const [cpuHistory, setCpuHistory] = useState<number[]>([])
  const [networkSpeed, setNetworkSpeed] = useState({ rx: 0, tx: 0 })
  const [time, setTime] = useState(new Date())
  const [logs, setLogs] = useState<string[]>([])
  
  // Blockchain state
  const [nodes, setNodes] = useState<BlockchainNode[]>([
    {
      id: 'node-1',
      name: 'Validator Node 1',
      status: 'active',
      blocks: 1245678,
      peers: 24,
      hash: '0x7f83b1657ff1fc53b92dc18148a1d65d7f83b165',
      lastBlock: '0x3a5e7f8b9c1d2e3f',
      transactions: 156,
      latency: 45,
      stake: 150000,
      version: 'v2.1.4'
    },
    {
      id: 'node-2',
      name: 'Validator Node 2',
      status: 'validating',
      blocks: 1245678,
      peers: 22,
      hash: '0x9f86d081884c7d659a2feaa0c55ad0159f86d081',
      lastBlock: '0x8c2d4e6f8a0b2c4d',
      transactions: 142,
      latency: 52,
      stake: 145000,
      version: 'v2.1.4'
    },
    {
      id: 'node-3',
      name: 'Mining Node',
      status: 'mining',
      blocks: 1245677,
      peers: 18,
      hash: '0x4b68ab3847feda7d6c62c1fbcbeebfa34b68ab38',
      lastBlock: '0x1f4b7e9a2c5d8f0b',
      transactions: 98,
      latency: 78,
      stake: 95000,
      version: 'v2.1.3'
    },
    {
      id: 'node-4',
      name: 'Light Client',
      status: 'syncing',
      blocks: 1245670,
      peers: 12,
      hash: '0x2c6b8c5d8f5d4c3b2a1f0e9d8c7b6a52c6b8c5d',
      lastBlock: '0x5e7a9b1c3d5f7a9b',
      transactions: 0,
      latency: 120,
      stake: 10000,
      version: 'v2.0.1'
    },
    {
      id: 'node-5',
      name: 'Archive Node',
      status: 'active',
      blocks: 1245678,
      peers: 32,
      hash: '0x8d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a8d5c4b3a',
      lastBlock: '0x2a4c6e8f0b2d4f6a',
      transactions: 1240,
      latency: 38,
      stake: 250000,
      version: 'v2.2.0'
    }
  ])
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-1',
      from: '0x7f83...d65d',
      to: '0x9f86...d015',
      amount: 25.5,
      fee: 0.0025,
      timestamp: new Date(Date.now() - 120000),
      status: 'finalized',
      hash: '0x3a5e7f8b9c1d2e3f4a5b6c7d8e9f0a1b',
      block: 1245678,
      confirmations: 124
    },
    {
      id: 'tx-2',
      from: '0x4b68...bfa3',
      to: '0x2c6b...b6a5',
      amount: 10.2,
      fee: 0.0018,
      timestamp: new Date(Date.now() - 60000),
      status: 'confirmed',
      hash: '0x8c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0',
      block: 1245679,
      confirmations: 42
    },
    {
      id: 'tx-3',
      from: '0x7f83...d65d',
      to: '0x2c6b...b6a5',
      amount: 5.7,
      fee: 0.0012,
      timestamp: new Date(Date.now() - 30000),
      status: 'confirmed',
      hash: '0x1f4b7e9a2c5d8f0b3e6a9c2d5f8b1e4',
      block: 1245679,
      confirmations: 38
    },
    {
      id: 'tx-4',
      from: '0x9f86...d015',
      to: '0x4b68...bfa3',
      amount: 15.3,
      fee: 0.0022,
      timestamp: new Date(Date.now() - 15000),
      status: 'pending',
      hash: '0x4c7d9e1f2a3b4c5d6e7f8a9b0c1d2e3f',
      block: undefined,
      confirmations: 0
    },
    {
      id: 'tx-5',
      from: '0x2c6b...b6a5',
      to: '0x7f83...d65d',
      amount: 8.9,
      fee: 0.0015,
      timestamp: new Date(Date.now() - 5000),
      status: 'pending',
      hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
      block: undefined,
      confirmations: 0
    }
  ])
  
  const [blocks, setBlocks] = useState<Block[]>([
    {
      height: 1245678,
      hash: '0x3a5e7f8b9c1d2e3f4a5b6c7d8e9f0a1b',
      timestamp: new Date(Date.now() - 180000),
      transactions: 156,
      size: 2450,
      miner: '0x7f83...d65d',
      difficulty: 17500000000
    },
    {
      height: 1245677,
      hash: '0x8c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0',
      timestamp: new Date(Date.now() - 360000),
      transactions: 142,
      size: 2320,
      miner: '0x9f86...d015',
      difficulty: 17450000000
    },
    {
      height: 1245676,
      hash: '0x1f4b7e9a2c5d8f0b3e6a9c2d5f8b1e4',
      timestamp: new Date(Date.now() - 540000),
      transactions: 168,
      size: 2510,
      miner: '0x4b68...bfa3',
      difficulty: 17400000000
    }
  ])

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ==================== REAL SYSTEM DATA ====================

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const data = await window.electronAPI.getFullSystemInfo()
        if (data) {
          setSys(data)
          // Keep only last log
          setLogs([`[${time.toLocaleTimeString('en-US', { hour12: false })}] System updated`])
        }
        
        const history = await window.electronAPI.getCPUHistory()
        setCpuHistory(history)
        
        const speed = await window.electronAPI.getNetworkSpeed()
        setNetworkSpeed(speed)
      } catch (error) {
        console.error('System fetch failed:', error)
        setLogs([`[${time.toLocaleTimeString('en-US', { hour12: false })}] Error`])
      }
    }

    fetchSystem()
    const interval = setInterval(fetchSystem, 2000)
    return () => clearInterval(interval)
  }, [time])

  // Simulate blockchain activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Update node status
      setNodes(prev => prev.map(node => {
        const statuses: ('active' | 'syncing' | 'validating' | 'mining')[] = 
          ['active', 'syncing', 'validating', 'mining']
        const newStatus = Math.random() > 0.8 
          ? statuses[Math.floor(Math.random() * statuses.length)]
          : node.status
        
        return {
          ...node,
          status: newStatus,
          blocks: node.blocks + (Math.random() > 0.95 ? 1 : 0),
          transactions: node.transactions + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0),
          latency: Math.max(10, node.latency + (Math.random() > 0.5 ? -1 : 1) * Math.floor(Math.random() * 5))
        }
      }))

      // Update transaction statuses
      setTransactions(prev => prev.map(tx => {
        if (tx.status === 'pending' && Math.random() > 0.4) {
          return {
            ...tx,
            status: 'confirmed',
            block: blocks[0].height + 1,
            confirmations: 1
          }
        }
        if (tx.status === 'confirmed' && tx.confirmations < 100 && Math.random() > 0.7) {
          return {
            ...tx,
            confirmations: tx.confirmations + 1
          }
        }
        return tx
      }))

      // Add new transaction occasionally
      if (Math.random() > 0.7) {
        const fromNodes = nodes.map(n => n.hash.slice(0, 10))
        const toNodes = nodes.map(n => n.hash.slice(0, 10))
        
        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          from: fromNodes[Math.floor(Math.random() * fromNodes.length)],
          to: toNodes[Math.floor(Math.random() * toNodes.length)],
          amount: Math.random() * 50,
          fee: Math.random() * 0.005,
          timestamp: new Date(),
          status: 'pending',
          hash: `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
          confirmations: 0
        }
        setTransactions(prev => [newTx, ...prev.slice(0, 19)])
      }

      // Add new block occasionally
      if (Math.random() > 0.8) {
        const newBlock: Block = {
          height: blocks[0].height + 1,
          hash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          timestamp: new Date(),
          transactions: Math.floor(Math.random() * 200) + 100,
          size: Math.floor(Math.random() * 1000) + 2000,
          miner: nodes[Math.floor(Math.random() * nodes.length)].hash.slice(0, 10),
          difficulty: blocks[0].difficulty + Math.floor(Math.random() * 100000000)
        }
        setBlocks(prev => [newBlock, ...prev.slice(0, 9)])
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [blocks])

  // ==================== UTILITIES ====================

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
  }

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatHash = (hash: string): string => {
    if (hash.length <= 12) return hash
    return `${hash.slice(0, 8)}...${hash.slice(-4)}`
  }

  // ==================== RENDER ====================

  if (!sys) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <div className="loading-text">INITIALIZING ED-DESK...</div>
        <div className="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
        <style>{`
          .loading {
            height: 100vh;
            background: #030303;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: 'SF Mono', monospace;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 2px solid #1e3a5f;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          .loading-text {
            font-size: 12px;
            letter-spacing: 2px;
            color: #ffffff;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  // Find WiFi interface
  const wifi = sys.network.find(n => n.type === 'wireless' || n.iface.toLowerCase().includes('wlan')) || {
    iface: 'Wi-Fi',
    ip4: '0.0.0.0',
    mac: '00:00:00:00:00:00',
    speed: 0,
    operstate: 'down',
    type: 'wireless',
    ssid: 'No Connection',
    signal: 0
  }

  // Determine if Bluetooth is actually enabled based on device count
  const bluetoothEnabled = sys.bluetooth.devices.length > 0

  return (
    <div className="app">
      {/* ASCII Art Header with System Log */}
      <div className="ascii-header">
        <pre className="glitch" data-text={`
  ███████╗██████╗       ██████╗ ███████╗███████╗██╗  ██╗
  ██╔════╝██╔══██╗      ██╔══██╗██╔════╝██╔════╝██║ ██╔╝
  █████╗  ██║  ██║█████╗██║  ██║█████╗  ███████╗█████╔╝ 
  ██╔══╝  ██║  ██║╚════╝██║  ██║██╔══╝  ╚════██║██╔═██╗ 
  ███████╗██████╔╝      ██████╔╝███████╗███████║██║  ██╗
  ╚══════╝╚═════╝       ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
        `}>{`
  ███████╗██████╗       ██████╗ ███████╗███████╗██╗  ██╗
  ██╔════╝██╔══██╗      ██╔══██╗██╔════╝██╔════╝██║ ██╔╝
  █████╗  ██║  ██║█████╗██║  ██║█████╗  ███████╗█████╔╝ 
  ██╔══╝  ██║  ██║╚════╝██║  ██║██╔══╝  ╚════██║██╔═██╗ 
  ███████╗██████╔╝      ██████╔╝███████╗███████║██║  ██╗
  ╚══════╝╚═════╝       ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
        `}</pre>
        <div className="header-info">
          <span className="version-tag">v1.0.0</span>
          <span className="time-tag">{formatTime(time)}</span>
          <div className="system-log">
            <span className="log-message">{logs[0] || '[System ready]'}</span>
          </div>
        </div>
      </div>

      {/* System Monitor Dashboard */}
      <div className="dashboard">
        {/* CPU Card */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">CPU</span>
            <span className="card-value">{sys.cpu.usage}%</span>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span>MODEL</span>
              <span className="truncate">{sys.cpu.brand}</span>
            </div>
            <div className="info-row">
              <span>CORES</span>
              <span>{sys.cpu.cores} ({sys.cpu.physicalCores}P)</span>
            </div>
            <div className="info-row">
              <span>SPEED</span>
              <span>{sys.cpu.speed} MHz</span>
            </div>
            <div className="info-row">
              <span>TEMP</span>
              <span>{sys.cpu.temperature}°C</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${sys.cpu.usage}%` }} />
            </div>
            <div className="sparkline">
              {cpuHistory.slice(-20).map((value, i) => (
                <div key={i} className="spark-bar" style={{ height: `${value}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Memory Card */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">MEMORY</span>
            <span className="card-value">{Math.round(sys.memory.used / 1024 / 1024 / 1024 * 10) / 10} GB</span>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span>TOTAL</span>
              <span>{formatBytes(sys.memory.total)}</span>
            </div>
            <div className="info-row">
              <span>USED</span>
              <span>{formatBytes(sys.memory.used)}</span>
            </div>
            <div className="info-row">
              <span>FREE</span>
              <span>{formatBytes(sys.memory.free)}</span>
            </div>
            <div className="info-row">
              <span>CACHED</span>
              <span>{formatBytes(sys.memory.buffcache)}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${sys.memory.percent}%` }} />
            </div>
          </div>
        </div>

        {/* Disk Card */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">DISK</span>
            <span className="card-value">{sys.disk[0]?.use || 0}%</span>
          </div>
          <div className="card-body">
            {sys.disk.map((disk, index) => (
              <div key={index} className="disk-item">
                <div className="info-row">
                  <span>{disk.fs}</span>
                  <span>{formatBytes(disk.used)} / {formatBytes(disk.size)}</span>
                </div>
                <div className="mini-bar">
                  <div className="mini-fill" style={{ width: `${disk.use}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Card */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">NETWORK</span>
            <span className="card-value">↓{(networkSpeed.rx / 1024).toFixed(0)}K</span>
          </div>
          <div className="card-body">
            <div className="network-section">
              <div className="info-row">
                <span>Wi-Fi</span>
                <span className={`status-badge ${wifi.operstate === 'up' ? 'active' : 'inactive'}`}>
                  {wifi.operstate === 'up' ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="info-row small">
                <span>{wifi.ip4}</span>
                <span>{wifi.speed} Mbps</span>
              </div>
              <div className="info-row small">
                <span className="mac">{wifi.mac}</span>
                {wifi.ssid && <span>{wifi.ssid}</span>}
              </div>
              {wifi.channel && (
                <div className="info-row small">
                  <span>Channel {wifi.channel}</span>
                  <span>{wifi.frequency}GHz</span>
                </div>
              )}
            </div>

            {/* Bluetooth Section - Static */}
            <div className="network-section">
              <div className="info-row">
                <span>BLUETOOTH</span>
                <span className={`status-badge ${sys.bluetooth.enabled ? 'active' : 'inactive'}`}>
                  {sys.bluetooth.enabled ? 'ON' : 'OFF'}
                </span>
              </div>
              {sys.bluetooth.enabled && sys.bluetooth.devices.length > 0 && (
                <div className="info-row small">
                  <span>DEVICES</span>
                  <span>0 connected</span>
                </div>
              )}
              {sys.bluetooth.enabled && sys.bluetooth.devices.length === 0 && (
                <div className="info-row small">
                  <span>DEVICES</span>
                  <span>0 connected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OS Card */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">SYSTEM</span>
            <span className="card-value">{sys.os.platform}</span>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span>OS</span>
              <span>{sys.os.distro}</span>
            </div>
            <div className="info-row">
              <span>KERNEL</span>
              <span>{sys.os.kernel}</span>
            </div>
            <div className="info-row">
              <span>ARCH</span>
              <span>{sys.os.arch}</span>
            </div>
            <div className="info-row">
              <span>USERS</span>
              <span>{sys.os.users}</span>
            </div>
            <div className="info-row">
              <span>LOAD</span>
              <span>{sys.os.loadavg[0].toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Processes Card */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">PROCESSES</span>
            <span className="card-value">PID • CPU</span>
          </div>
          <div className="card-body">
            {sys.processes.slice(0, 5).map((proc, i) => (
              <div key={i} className="process-row">
                <span className="process-pid">{proc.pid}</span>
                <span className="process-name truncate">{proc.name}</span>
                <span className="process-cpu">{proc.cpu.toFixed(1)}%</span>
              </div>
            ))}
            <div className="info-row small">
              <span>THREADS</span>
              <span>{sys.processes.reduce((acc, p) => acc + (p.threads || 1), 0)}</span>
            </div>
          </div>
        </div>

        {/* Battery Card - Simplified */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">BATTERY</span>
            <span className="card-value">
              {sys.battery.hasBattery ? `${sys.battery.percent}%` : 'AC'}
            </span>
          </div>
          <div className="card-body">
            {sys.battery.hasBattery ? (
              <>
                <div className="info-row">
                  <span>STATUS</span>
                  <span>{sys.battery.discharging ? 'DISCHARGING' : 'CHARGING'}</span>
                </div>
                <div className="info-row">
                  <span>REMAINING</span>
                  <span>{Math.floor(sys.battery.timeRemaining / 60)} min</span>
                </div>
                {!sys.battery.discharging && (
                  <div className="info-row">
                    <span>TO FULL</span>
                    <span>{Math.floor(sys.battery.timeToFull / 60)} min</span>
                  </div>
                )}
                <div className="info-row">
                  <span>VOLTAGE</span>
                  <span>{sys.battery.voltage}V</span>
                </div>
                <div className="info-row">
                  <span>TEMP</span>
                  <span>{sys.battery.temperature}°C</span>
                </div>
                {sys.battery.discharging && (
                  <div className="info-row">
                    <span>DISCHARGE</span>
                    <span>{sys.battery.dischargeRate} W</span>
                  </div>
                )}
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${sys.battery.percent}%` }} />
                </div>
              </>
            ) : (
              <div className="info-row">
                <span>POWER</span>
                <span>AC • 230V</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Card - Added Uptime and PID */}
        <div className="monitor-card">
          <div className="card-header">
            <span className="card-title">STATUS</span>
            <span className="card-value">✓</span>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span>UPTIME</span>
              <span>{formatUptime(sys.os.uptime)}</span>
            </div>
            <div className="info-row">
              <span>PID</span>
              <span>{sys.node.pid}</span>
            </div>
            <div className="info-row">
              <span>MEM</span>
              <span>{formatBytes(sys.node.memory.rss)}</span>
            </div>
            <div className="info-row">
              <span>NODE</span>
              <span>{sys.node.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Network Section - Always Visible */}
      <div className="blockchain-section">
        <div className="blockchain-header">
          <h3>BLOCKCHAIN NETWORK • END-TO-END ENCRYPTION</h3>
          <div className="blockchain-stats">
            <div className="stat">
              <span className="stat-label">ACTIVE NODES</span>
              <span className="stat-value">{nodes.filter(n => n.status === 'active').length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">TOTAL BLOCKS</span>
              <span className="stat-value">{nodes[0].blocks.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">PENDING TX</span>
              <span className="stat-value">{transactions.filter(t => t.status === 'pending').length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">NETWORK HASH</span>
              <span className="stat-value">2.45 PH/s</span>
            </div>
          </div>
        </div>

        {/* Node Visualization */}
        <div className="nodes-container">
          {nodes.map((node, index) => (
            <div key={node.id} className="node-card">
              <div className="node-header">
                <span className="node-name">{node.name}</span>
                <span className={`node-status ${node.status}`}>{node.status}</span>
              </div>
              <div className="node-content">
                <div className="node-info">
                  <span>Blocks</span>
                  <span>{node.blocks.toLocaleString()}</span>
                </div>
                <div className="node-info">
                  <span>Peers</span>
                  <span>{node.peers}</span>
                </div>
                <div className="node-info">
                  <span>TX Pool</span>
                  <span>{node.transactions}</span>
                </div>
                <div className="node-info">
                  <span>Latency</span>
                  <span>{node.latency}ms</span>
                </div>
                <div className="node-info">
                  <span>Stake</span>
                  <span>{(node.stake / 1000).toFixed(1)}K</span>
                </div>
                <div className="node-info">
                  <span>Hash</span>
                  <span className="hash">{formatHash(node.hash)}</span>
                </div>
                <div className="node-info">
                  <span>Last Block</span>
                  <span className="hash">{node.lastBlock}</span>
                </div>
              </div>
              
              {/* Connection lines with animated packets */}
              {index < nodes.length - 1 && (
                <div className="connection-line">
                  <div className="line"></div>
                  <div className="data-packet"></div>
                  <div className="data-packet delay-1"></div>
                  <div className="data-packet delay-2"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Blocks */}
        <div className="blocks-container">
          <h4>RECENT BLOCKS</h4>
          <div className="blocks-list">
            {blocks.slice(0, 3).map(block => (
              <div key={block.height} className="block-item">
                <div className="block-header">
                  <span className="block-height">#{block.height}</span>
                  <span className="block-time">{formatTime(block.timestamp)}</span>
                </div>
                <div className="block-details">
                  <span className="block-hash">{formatHash(block.hash)}</span>
                  <span className="block-tx">{block.transactions} tx</span>
                  <span className="block-miner">{formatHash(block.miner)}</span>
                </div>
                <div className="block-size">{block.size} KB • Diff {Math.floor(block.difficulty / 1e9)}B</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Transaction Pool */}
        <div className="transaction-pool">
          <h4>LIVE TRANSACTION POOL</h4>
          <div className="transactions-list">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className={`transaction-item ${tx.status}`}>
                <div className="tx-header">
                  <span className="tx-hash">{formatHash(tx.hash)}</span>
                  <span className={`tx-status ${tx.status}`}>{tx.status}</span>
                </div>
                <div className="tx-details">
                  <span>{formatHash(tx.from)} → {formatHash(tx.to)}</span>
                  <span className="tx-amount">{tx.amount.toFixed(2)} ETH</span>
                </div>
                <div className="tx-meta">
                  <span>Fee: {tx.fee.toFixed(4)} ETH</span>
                  {tx.block && <span>Block #{tx.block}</span>}
                  {tx.confirmations > 0 && <span>{tx.confirmations} conf</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How End-to-End Encryption Works - No emojis */}
        <div className="blockchain-explanation">
          <h4>HOW END-TO-END ENCRYPTION WORKS WITH BLOCKCHAIN</h4>
          <div className="explanation-grid">
            <div className="exp-card">
              <h5>End-to-End Encryption</h5>
              <p>Messages are encrypted on your device using AES-256-GCM. Only the recipient's private key can decrypt the content. Blockchain nodes verify integrity without accessing data.</p>
            </div>
            <div className="exp-card">
              <h5>Blockchain Verification</h5>
              <p>Each message creates a SHA-3 hash stored on the blockchain. The hash provides immutable proof of sending, timestamp, and integrity without exposing the actual content.</p>
            </div>
            <div className="exp-card">
              <h5>Peer-to-Peer Network</h5>
              <p>Messages travel through 5-7 validator nodes. Each node verifies the hash signature using ECDSA, contributing to consensus without decryption capability.</p>
            </div>
            <div className="exp-card">
              <h5>Smart Contract Validation</h5>
              <p>Smart contracts automatically verify message delivery and can trigger actions when conditions are met. All contract executions are recorded on-chain.</p>
            </div>
          </div>
        </div>

        {/* Network Metrics */}
        <div className="network-metrics">
          <div className="metric">
            <span className="metric-label">TOTAL TRANSACTIONS</span>
            <span className="metric-value">{(1245678 * 156).toLocaleString()}</span>
          </div>
          <div className="metric">
            <span className="metric-label">AVG BLOCK TIME</span>
            <span className="metric-value">12.4s</span>
          </div>
          <div className="metric">
            <span className="metric-label">NETWORK DIFFICULTY</span>
            <span className="metric-value">17.5 GH</span>
          </div>
          <div className="metric">
            <span className="metric-label">TOTAL STAKE</span>
            <span className="metric-value">650K ETH</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <span className="powered">POWERED BY BLOCKCHAIN • END-TO-END ENCRYPTED • KK PROFESSIONAL</span>
      </div>

      {/* Scan Line Effect */}
      <div className="scan-line" />

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background: #030303;
          color: #ffffff;
          font-family: 'SF Mono', 'Monaco', 'Fira Code', monospace;
          font-size: 11px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
        }

        /* Scan Line Effect */
        .scan-line {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(30, 58, 95, 0.03) 50%,
            transparent 100%
          );
          pointer-events: none;
          animation: scan 8s linear infinite;
          z-index: 1000;
        }

        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        /* ASCII Header */
        .ascii-header {
          background: #0a0a0a;
          border: 1px solid #1e3a5f;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .ascii-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #1e3a5f, transparent);
          animation: scanline 3s linear infinite;
        }

        @keyframes scanline {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .glitch {
          position: relative;
          color: #1e3a5f;
          font-size: 7px;
          line-height: 1.2;
          text-shadow: 0 0 5px #1e3a5f;
        }

        .header-info {
          display: flex;
          gap: 16px;
          align-items: center;
          background: #050505;
          padding: 6px 12px;
          border: 1px solid #1e3a5f;
        }

        .version-tag { color: #1e3a5f; }
        .time-tag { color: #ffffff; }

        .system-log {
          border-left: 1px solid #1e3a5f;
          padding-left: 12px;
          margin-left: 4px;
        }

        .log-message {
          color: #ffffff;
          font-size: 9px;
          font-family: monospace;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Dashboard Grid */
        .dashboard {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #1e3a5f;
          border: 1px solid #1e3a5f;
        }

        .monitor-card {
          background: #0a0a0a;
          padding: 12px;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .monitor-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(30, 58, 95, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1e3a5f;
          padding-bottom: 6px;
        }

        .card-title {
          color: #ffffff;
          font-size: 10px;
          letter-spacing: 1px;
          opacity: 0.8;
        }

        .card-value {
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
        }

        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #ffffff;
        }

        .info-row.small {
          font-size: 9px;
          color: #ffffff;
          opacity: 0.7;
        }

        .truncate {
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .progress-bar {
          height: 3px;
          background: #222;
          margin-top: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #1e3a5f;
          transition: width 0.3s;
        }

        .mini-bar {
          height: 2px;
          background: #222;
          margin: 2px 0;
        }

        .mini-fill {
          height: 100%;
          background: #1e3a5f;
          transition: width 0.3s;
        }

        .sparkline {
          display: flex;
          align-items: flex-end;
          gap: 1px;
          height: 20px;
          margin-top: 4px;
        }

        .spark-bar {
          flex: 1;
          background: #1e3a5f;
          opacity: 0.5;
          transition: height 0.3s;
        }

        .disk-item {
          margin-bottom: 4px;
        }

        .network-section {
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px dotted #1e3a5f;
        }

        .network-section:last-child {
          border-bottom: none;
        }

        .status-badge {
          font-size: 8px;
          padding: 2px 6px;
          border-radius: 2px;
          text-transform: uppercase;
          color: #ffffff;
        }

        .status-badge.active {
          background: rgba(30, 58, 95, 0.3);
        }

        .status-badge.inactive {
          background: rgba(102, 102, 102, 0.3);
        }

        .mac {
          font-family: monospace;
          color: #ffffff;
          opacity: 0.7;
        }

        .process-row {
          display: flex;
          gap: 6px;
          font-size: 9px;
          padding: 2px 0;
          border-bottom: 1px dotted #1e3a5f;
          color: #ffffff;
        }

        .process-pid { width: 35px; color: #ffffff; opacity: 0.7; }
        .process-name { flex: 1; color: #ffffff; }
        .process-cpu { width: 35px; text-align: right; color: #ffffff; }

        .bluetooth-device {
          padding-left: 12px;
          color: #ffffff;
        }

        /* Blockchain Section */
        .blockchain-section {
          background: #0a0a0a;
          border: 1px solid #1e3a5f;
          padding: 20px;
          margin-top: 8px;
        }

        .blockchain-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #1e3a5f;
        }

        .blockchain-header h3 {
          color: #ffffff;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .blockchain-stats {
          display: flex;
          gap: 20px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 8px;
          color: #ffffff;
          opacity: 0.6;
        }

        .stat-value {
          font-size: 14px;
          color: #ffffff;
          font-weight: bold;
        }

        /* Nodes Container */
        .nodes-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin: 30px 0;
          position: relative;
          flex-wrap: wrap;
          gap: 20px;
        }

        .node-card {
          background: #111;
          border: 1px solid #1e3a5f;
          padding: 15px;
          width: 200px;
          position: relative;
          transition: all 0.3s ease;
        }

        .node-card:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(30, 58, 95, 0.5);
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #1e3a5f;
        }

        .node-name {
          color: #ffffff;
          font-size: 11px;
        }

        .node-status {
          font-size: 8px;
          padding: 2px 6px;
          border-radius: 2px;
          text-transform: uppercase;
          color: #ffffff;
        }

        .node-status.active { background: rgba(30, 58, 95, 0.3); }
        .node-status.syncing { background: rgba(255, 255, 255, 0.2); }
        .node-status.validating { background: rgba(30, 58, 95, 0.5); }
        .node-status.mining { background: rgba(255, 255, 255, 0.3); }

        .node-content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .node-info {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #ffffff;
        }

        .hash {
          color: #ffffff;
          opacity: 0.8;
          font-family: monospace;
        }

        .connection-line {
          position: absolute;
          top: 50%;
          right: -50px;
          width: 50px;
          height: 2px;
        }

        .line {
          width: 100%;
          height: 1px;
          background: #1e3a5f;
          position: relative;
        }

        .data-packet {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #ffffff;
          border-radius: 50%;
          animation: movePacket 2s infinite;
        }

        .data-packet.delay-1 { animation-delay: 0.5s; }
        .data-packet.delay-2 { animation-delay: 1s; }

        @keyframes movePacket {
          0% { left: 0; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        /* Blocks Container */
        .blocks-container {
          margin: 20px 0;
        }

        .blocks-container h4 {
          color: #ffffff;
          font-size: 11px;
          margin-bottom: 10px;
        }

        .blocks-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .block-item {
          background: #111;
          border: 1px solid #1e3a5f;
          padding: 10px;
        }

        .block-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          padding-bottom: 3px;
          border-bottom: 1px dotted #1e3a5f;
        }

        .block-height {
          color: #ffffff;
          font-weight: bold;
        }

        .block-time {
          color: #ffffff;
          opacity: 0.7;
          font-size: 8px;
        }

        .block-details {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          margin-bottom: 3px;
          color: #ffffff;
        }

        .block-hash, .block-miner {
          color: #ffffff;
          opacity: 0.8;
        }

        .block-tx {
          color: #ffffff;
        }

        .block-size {
          font-size: 7px;
          color: #ffffff;
          opacity: 0.6;
        }

        /* Transaction Pool */
        .transaction-pool {
          margin: 20px 0;
        }

        .transaction-pool h4 {
          color: #ffffff;
          font-size: 11px;
          margin-bottom: 10px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 250px;
          overflow-y: auto;
        }

        .transaction-item {
          background: #111;
          border: 1px solid #1e3a5f;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .transaction-item:hover {
          background: #1a1a1a;
        }

        .transaction-item.pending { border-left: 3px solid #ffffff; }
        .transaction-item.confirmed { border-left: 3px solid #ffffff; opacity: 0.9; }
        .transaction-item.finalized { border-left: 3px solid #ffffff; opacity: 0.8; }

        .tx-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .tx-hash {
          color: #ffffff;
          font-size: 9px;
          font-family: monospace;
        }

        .tx-status {
          font-size: 8px;
          padding: 2px 6px;
          border-radius: 2px;
          text-transform: uppercase;
          color: #ffffff;
        }

        .tx-status.pending { background: rgba(255, 255, 255, 0.2); }
        .tx-status.confirmed { background: rgba(30, 58, 95, 0.3); }
        .tx-status.finalized { background: rgba(30, 58, 95, 0.5); }

        .tx-details {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #ffffff;
          margin-bottom: 3px;
        }

        .tx-amount {
          color: #ffffff;
          font-weight: bold;
        }

        .tx-meta {
          display: flex;
          gap: 10px;
          font-size: 7px;
          color: #ffffff;
          opacity: 0.6;
        }

        /* Blockchain Explanation - No emojis */
        .blockchain-explanation {
          margin: 20px 0;
          padding-top: 20px;
          border-top: 1px solid #1e3a5f;
        }

        .blockchain-explanation h4 {
          color: #ffffff;
          font-size: 11px;
          margin-bottom: 15px;
        }

        .explanation-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .exp-card {
          background: #111;
          border: 1px solid #1e3a5f;
          padding: 15px;
          transition: all 0.3s ease;
        }

        .exp-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(30, 58, 95, 0.3);
        }

        .exp-card h5 {
          color: #ffffff;
          font-size: 10px;
          margin-bottom: 8px;
        }

        .exp-card p {
          color: #ffffff;
          font-size: 9px;
          line-height: 1.4;
          opacity: 0.9;
        }

        /* Network Metrics */
        .network-metrics {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #1e3a5f;
        }

        .metric {
          text-align: center;
        }

        .metric-label {
          display: block;
          font-size: 8px;
          color: #ffffff;
          opacity: 0.6;
          margin-bottom: 3px;
        }

        .metric-value {
          font-size: 12px;
          color: #ffffff;
          font-weight: bold;
        }

        /* Footer */
        .footer {
          background: #0a0a0a;
          border: 1px solid #1e3a5f;
          padding: 8px 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 9px;
        }

        .powered {
          color: #ffffff;
          letter-spacing: 1px;
          opacity: 0.9;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        ::-webkit-scrollbar-track {
          background: #111;
        }

        ::-webkit-scrollbar-thumb {
          background: #222;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #1e3a5f;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .dashboard {
            grid-template-columns: repeat(2, 1fr);
          }
          .explanation-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .blocks-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            grid-template-columns: 1fr;
          }
          .header-info {
            flex-direction: column;
            gap: 8px;
          }
          .blockchain-stats {
            flex-wrap: wrap;
          }
          .nodes-container {
            flex-direction: column;
          }
          .connection-line {
            display: none;
          }
          .explanation-grid {
            grid-template-columns: 1fr;
          }
          .network-metrics {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  )
}