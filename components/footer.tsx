"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Hermes Agent</h3>
            <p className="text-muted-foreground">
              Open source AI agent by{" "}
              <a
                href="https://nousresearch.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Nous Research
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/NousResearch/Hermes-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://nousresearch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Nous Research</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-500" /> by the open
            source community
          </p>
          <p className="mt-2">MIT License</p>
        </motion.div>
      </div>
    </footer>
  );
}
