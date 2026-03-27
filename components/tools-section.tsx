"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  FileText,
  Globe,
  Eye,
  Brain,
  Users,
  Clock,
  Puzzle,
  Container,
  Cloud,
  Server,
  Key,
} from "lucide-react";

const toolsets = [
  {
    name: "Terminal",
    icon: Terminal,
    tools: ["bash", "python", "ipython"],
    desc: "Execute shell commands and scripts",
    backends: ["Local", "Docker", "Modal", "Daytona", "SSH", "Singularity"],
  },
  {
    name: "File",
    icon: FileText,
    tools: ["read_file", "write_file", "list_dir", "search_files"],
    desc: "Full filesystem operations",
  },
  {
    name: "Web",
    icon: Globe,
    tools: ["web_search", "fetch_url", "scrape_page"],
    desc: "Internet access and research",
  },
  {
    name: "Browser",
    icon: Eye,
    tools: ["navigate", "click", "type", "screenshot"],
    desc: "Full browser automation",
  },
  {
    name: "Vision",
    icon: Eye,
    tools: ["analyze_image", "ocr", "describe"],
    desc: "Image understanding and OCR",
  },
  {
    name: "Memory",
    icon: Brain,
    tools: ["store", "recall", "search_memory"],
    desc: "Long-term knowledge storage",
  },
  {
    name: "Delegate",
    icon: Users,
    tools: ["spawn_agent", "coordinate"],
    desc: "Multi-agent orchestration",
  },
  {
    name: "Cron",
    icon: Clock,
    tools: ["schedule_job", "list_jobs", "cancel_job"],
    desc: "Scheduled task execution",
  },
  {
    name: "Skills",
    icon: Puzzle,
    tools: ["load_skill", "execute_skill"],
    desc: "Procedural memory system",
  },
];

const backends = [
  { name: "Local", icon: Terminal, desc: "Native shell execution" },
  { name: "Docker", icon: Container, desc: "Containerized environments" },
  { name: "Modal", icon: Cloud, desc: "Serverless compute" },
  { name: "Daytona", icon: Server, desc: "Dev environments" },
  { name: "SSH", icon: Key, desc: "Remote machines" },
  { name: "Singularity", icon: Container, desc: "HPC containers" },
];

export function ToolsSection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Extensible Tool System
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            40+ tools organized into logical toolsets. Each tool is registered
            via a decorator pattern for automatic schema generation and
            validation.
          </p>
        </motion.div>

        {/* Toolsets grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {toolsets.map((toolset, i) => (
            <motion.div
              key={toolset.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:glow-sm transition-all">
                  <toolset.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1">{toolset.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {toolset.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {toolset.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 text-xs font-mono bg-muted rounded-md text-muted-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terminal Backends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            6 Terminal Backends
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-balance">
            Execute code anywhere - from local shells to cloud compute to HPC
            clusters.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {backends.map((backend, i) => (
            <motion.div
              key={backend.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 text-center hover:glow-sm transition-all"
            >
              <backend.icon className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="font-medium text-sm">{backend.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {backend.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
