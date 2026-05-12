'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Maximize, BedDouble, Bath } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getStatusColor } from '@/lib/utils'

interface Property {
  id: string
  title: string
  type: string
  price: number
  area: number
  rooms?: number | null
  bathrooms?: number | null
  city: string
  image?: string | null
  status: string
  featured?: boolean
}

interface PropertyCardProps {
  property: Property
  onClick: (id: string) => void
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm"
      onClick={() => onClick(property.id)}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <MapPin className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
          {property.featured && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-600">
              مميز
            </Badge>
          )}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
          <p className="text-lg font-bold text-white">
            {formatPrice(property.price)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-1">
          {property.title}
        </h3>
        <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{property.city}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5" />
            <span>{property.area} م²</span>
          </div>
          {property.rooms && (
            <div className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              <span>{property.rooms} غرف</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              <span>{property.bathrooms}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
