'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: 'up' | 'down'
    color?: string
  }[]
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              {stat.description && (
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              )}
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color || 'bg-primary/10'}`}>
              <stat.icon className={`h-5 w-5 ${stat.color ? 'text-white' : 'text-primary'}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
