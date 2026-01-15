import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryCards } from '@/components/home/category-cards'
import { WhySection } from '@/components/home/why-section'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryCards />
      <WhySection />
      <CTASection />
    </>
  )
}
