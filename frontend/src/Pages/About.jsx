import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'
const About = () => {
  return (
    <div className='px-25'>
      <div className='text-2xl text-center pt-8 border-t '>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt=''/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Forever was born out of a passion for innovation and a desire to revolution the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover,explore and purchase a wide range of products from the comfort of their home.</p>
          <p>Since day one, we’ve been dedicated to offering a wide range of premium products designed to suit every taste and lifestyle. From fashion and beauty to electronics and home essentials, our carefully curated collection features items from reliable and trusted brands.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>At Forever, our mission is to empower customers by offering choice, convenience, and confidence. We’re committed to delivering a smooth and satisfying shopping experience—from browsing and ordering to delivery and beyond.</p>
        </div>
      </div>
      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering process,shopping has never been easier</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our team of dedicated is here to assist you the way,ensuring your satisfaction is our top priority.</p>
        </div>
      </div> 
        <NewsLetterBox/>

    </div>
  )
}

export default About
