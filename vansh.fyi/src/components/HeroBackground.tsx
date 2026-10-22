'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { publicImage } from '../../lib/public-images'
import { scheduleWarmup } from '../utils/warmup'

const dark = publicImage('/images/hero_dark_focus.webp', 1020).src
const light = publicImage('/images/hero_light_focus.webp', 1020).src
const style = {
  '--hero-dark': `url("${dark}")`,
  '--hero-light': `url("${light}")`,
  '--hero-dark-small': `url("${publicImage('/images/hero_dark_focus.webp', 640).src}")`,
  '--hero-light-small': `url("${publicImage('/images/hero_light_focus.webp', 640).src}")`,
} as CSSProperties

export default function HeroBackground() {
  const [warmed, setWarmed] = useState(false)
  useEffect(() => {
    let cancelled = false
    const cancelWarmup = scheduleWarmup(() => {
      const alternate = document.body.classList.contains('light-mode')
        ? '/images/hero_dark_focus.webp'
        : '/images/hero_light_focus.webp'
      const image = new Image()
      image.onload = () => {
        if (!cancelled) setWarmed(true)
      }
      image.src = publicImage(
        alternate,
        window.innerWidth < 768 ? 640 : 1020
      ).src
    })
    return () => {
      cancelled = true
      cancelWarmup()
    }
  }, [])
  return (
    <div
      aria-hidden="true"
      className="hero-images absolute inset-0 pointer-events-none"
      data-warmed={warmed}
      style={style}
    >
      <div
        id="dark-bg-image"
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-40"
      />
      <div
        id="light-bg-image"
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-0"
      />
    </div>
  )
}
