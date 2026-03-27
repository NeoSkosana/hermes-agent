"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  MessageSquare,
  Code2,
  Database,
  Cpu,
  Layers,
  Workflow,
  Bot,
  Zap,
  Globe,
  Server,
  FileCode,
} from "lucide-react";

const layers = [
  {
    title: "Entry Points",
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-400",
    items: [
      { icon: Terminal, name: "CLI", file: "hermes_cli/main.py" },
      { icon: MessageSquare, name: "Gateway", file: "gateway/run.py" },
      { icon: Code2, name: "ACP Adapter", file: "acp_adapter/" },
      { icon: Workflow, name: "Batch Runner", file: "batch_runner.py" },
      { icon: Cpu, name: "RL Environments", file: "environments/" },
    ],
  },
  {
    title: "Core Agent Engine",
    color: "from-cyan-500/20 to-cyan-500/5",
    borderColor: "border-cyan-500/30",
    accentColor: "text-cyan-400",
    items: [
      { icon: Bot, name: "AIAgent Class", file: "run_agent.py" },
      { icon: Zap, name: "Tool Execution", file: "model_tools.py" },
      { icon: Layers, name: "State Manager", file: "hermes_state.py" },
      { icon: FileCode, name: "Prompt Builder", file: "run_agent.py" },
    ],
  },
  {
    title: "Tool System",
    color: "from-violet-500/20 to-violet-500/5",
    borderColor: "border-violet-500/30",
    accentColor: "text-violet-400",
    items: [
      { icon: Server, name: "Registry", file: "tools/registry.py" },
      { icon: Terminal, name: "Terminal Tools", file: "tools/terminal.py" },
      { icon: Globe, name: "Web Tools", file: "tools/web.py" },
      { icon: Database, name: "Memory Tools", file: "tools/memory.py" },
    ],
  },
  {
    title: "Persistence Layer",
    color: "from-amber-500/20 to-amber-500/5",
    borderColor: "border-amber-500/30",
    accentColor: "text-amber-400",
    items: [
      { icon: Database, name: "SQLite + FTS5", file: "hermes_state.py" },
      { icon: FileCode, name: "JSONL Files", file: "session_*.jsonl" },
      { icon: Layers, name: "Honcho", file: "honcho_integration/" },
    ],
  },
];

export function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            System Architecture
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            A layered architecture designed for extensibility, with clear
            separation of concerns between entry points, core logic, tools, and
            persistence.
          </p>
        </motion.div>

        {/* Architecture layers */}
        <div className="space-y-6">
          {layers.map((layer, layerIndex) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: layerIndex * 0.1 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-r ${layer.color} border ${layer.borderColor}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="lg:w-48 flex-shrink-0">
                  <h3 className={`text-xl font-semibold ${layer.accentColor}`}>
                    {layer.title}
                  </h3>
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {layer.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: layerIndex * 0.1 + itemIndex * 0.05,
                      }}
                      className="group p-4 rounded-xl bg-card/80 border border-border hover:border-accent/50 transition-all hover:glow-sm cursor-default"
                    >
                      <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors mb-2" />
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1 truncate">
                        {item.file}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Connector line */}
              {layerIndex < layers.length - 1 && (
                <div className="absolute left-1/2 -bottom-6 w-px h-6 bg-gradient-to-b from-border to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Flow arrows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 rounded-2xl bg-card/50 border border-border"
        >
          <h3 className="text-lg font-semibold mb-4 text-center">Data Flow</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              User Input
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Agent Loop
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Tool Execution
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              State Update
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Response
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
