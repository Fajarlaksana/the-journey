import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@thejourney.com' },
    update: {},
    create: {
      email: 'admin@thejourney.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  // Create brands
  const brands = [
    { name: 'Toyota', slug: 'toyota', country: 'Japan' },
    { name: 'Nissan', slug: 'nissan', country: 'Japan' },
    { name: 'Honda', slug: 'honda', country: 'Japan' },
    { name: 'Mazda', slug: 'mazda', country: 'Japan' },
    { name: 'Subaru', slug: 'subaru', country: 'Japan' },
    { name: 'Mitsubishi', slug: 'mitsubishi', country: 'Japan' },
    { name: 'BMW', slug: 'bmw', country: 'Germany' },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', country: 'Germany' },
    { name: 'Audi', slug: 'audi', country: 'Germany' },
    { name: 'Volkswagen', slug: 'volkswagen', country: 'Germany' },
    { name: 'Ford', slug: 'ford', country: 'USA' },
    { name: 'Chevrolet', slug: 'chevrolet', country: 'USA' },
    { name: 'Dodge', slug: 'dodge', country: 'USA' },
    { name: 'Lexus', slug: 'lexus', country: 'Japan' },
    { name: 'Infiniti', slug: 'infiniti', country: 'Japan' },
  ]

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    })
  }

  // Create categories
  const categories = [
    { name: 'JDM', slug: 'jdm', description: 'Japanese Domestic Market builds' },
    { name: 'Stance', slug: 'stance', description: 'Lowered and cambered stance builds' },
    { name: 'Track', slug: 'track', description: 'Track-focused performance builds' },
    { name: 'Drift', slug: 'drift', description: 'Drift competition builds' },
    { name: 'Show Car', slug: 'show-car', description: 'Show and display builds' },
    { name: 'Street Build', slug: 'street-build', description: 'Street-driven daily builds' },
    { name: 'Off-Road', slug: 'off-road', description: 'Off-road and overland builds' },
    { name: 'Restomod', slug: 'restomod', description: 'Restored with modern upgrades' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create awards
  const awards = [
    { name: 'Winner', slug: 'winner', description: 'Overall event winner' },
    { name: 'Top 5', slug: 'top-5', description: 'Top 5 finalist' },
    { name: 'Top 10', slug: 'top-10', description: 'Top 10 finalist' },
    { name: 'Best Engine', slug: 'best-engine', description: 'Best engine bay' },
    { name: 'Best Interior', slug: 'best-interior', description: 'Best interior design' },
    { name: 'Best Exterior', slug: 'best-exterior', description: 'Best exterior design' },
    { name: 'Best Paint', slug: 'best-paint', description: 'Best paint job' },
    { name: 'Best Wheels', slug: 'best-wheels', description: 'Best wheel fitment' },
    { name: 'People\'s Choice', slug: 'peoples-choice', description: 'People\'s choice award' },
  ]

  for (const award of awards) {
    await prisma.award.upsert({
      where: { slug: award.slug },
      update: {},
      create: award,
    })
  }

  // Create events
  const events = [
    { name: 'Tokyo Auto Salon', slug: 'tokyo-auto-salon', year: 2024, location: 'Chiba, Japan', featured: true },
    { name: 'Tokyo Auto Salon', slug: 'tokyo-auto-salon-2023', year: 2023, location: 'Chiba, Japan', featured: true },
    { name: 'SEMA Show', slug: 'sema-show', year: 2024, location: 'Las Vegas, USA', featured: true },
    { name: 'SEMA Show', slug: 'sema-show-2023', year: 2023, location: 'Las Vegas, USA', featured: false },
    { name: 'StanceNation', slug: 'stancenation', year: 2024, location: 'Georgia, USA', featured: true },
    { name: 'StanceNation', slug: 'stancenation-2023', year: 2023, location: 'Georgia, USA', featured: false },
    { name: 'Wekfest', slug: 'wekfest', year: 2024, location: 'Various, USA', featured: true },
    { name: 'Wekfest', slug: 'wekfest-2023', year: 2023, location: 'Various, USA', featured: false },
    { name: 'Formula Drift', slug: 'formula-drift', year: 2024, location: 'Various, USA', featured: true },
    { name: 'NATS', slug: 'nats', year: 2024, location: 'Georgia, USA', featured: false },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
