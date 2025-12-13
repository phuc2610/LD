import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className='bg-[#f9f9f9]'>
      <Hero />
      <div className='bg-white'>
        <LatestCollection/>
        <BestSeller />
        <OurPolicy />
        <NewsletterBox />
      </div>
    </div>
  )
}

export default Home