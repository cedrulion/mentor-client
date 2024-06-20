import React from 'react';
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaSearch, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LOGO from "../Assets/LOGO.png";

export default function Nav() {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className='text-white min-h-screen bg-gradient-to-l from-orange-600 to-gray-950'>
      <div className='sticky top-0 z-10 md:flex justify-between shadow-2xl pt-3 bg-gradient-to-l from-orange-600 to-gray-950'>
        <div className='flex justify-between gap-4'>
          <img src={LOGO} alt="logo" className="h-12 rounded-full ml-6" />
          <h1 className='text-white font-Roboto text-xl pt-2'>National Women's Council</h1>
        </div>
        <div className=''>
          <ul className='capitalize md:flex text-[18px] space-x-9 ml-24 pt-3'>
            <li className='text-white px-6 rounded-lg font-Ubuntu active' onClick={() => handleScrollTo('home')}>Home</li>
            <li className='text-white px-6 rounded-lg font-Ubuntu active' onClick={() => handleScrollTo('aboutus')}>About Us</li>
            <li className='text-white px-6 rounded-lg font-Ubuntu active' onClick={() => handleScrollTo('getus')}>Contact</li>
            <li className='text-white px-6 rounded-lg font-Ubuntu active bg-orange-950'><Link to='/signin'>SIGN-IN</Link></li>
          </ul>
        </div>
      </div>

      <div className='container text-3xl pl-32 pt-9 font-Roboto'>
        <p>Elevating Women In </p>
        <p>Security: Unleashing </p>
        <p>Knowledge, Nurturing</p>
        <p>Excellence</p>
      </div>

      <div className='container text-xl pl-32 pt-3 font-Roboto'>
        <h1>Empowering women with the skills,</h1>
        <h1>knowledge, and confidence to thrive</h1>
        <h1>in security careers</h1>
      </div>

      <section className='py-9 mx-32'>
        <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* First Card */}
          <div className='bg-white text-black border-black border-[1.5px] w-full rounded-lg p-6 flex flex-col justify-between'>
            <div className='pb-6'>
              <h1 className='font-Roboto font-bold text-center text-xl py-3'>Your Journey starts Here.</h1>
              <p className='mx-8 font-Roboto'>Join the movement for women in security today. Create a future where women excel in the security industry.</p>
            </div>
            <button className='text-white bg-gradient-to-l from-red-500 to-orange-600 w-full rounded py-3 mt-auto'>Join us today!</button>
          </div>
          {/* Second Card */}
          <div className='bg-white text-black border-black border-[1.5px] w-full rounded-lg p-6 flex flex-col justify-between'>
            <div className='pb-6'>
              <h1 className='font-Roboto font-bold text-center py-3 text-xl'>Connect, Learn, Thrive.</h1>
              <p className='mx-8 font-Roboto'>Your gateway to a supportive community. Build your security career with us. Connect, gain insights, and advance.</p>
            </div>
            <button className='text-white bg-gradient-to-l from-violet-800 to-orange-950 w-full rounded py-3 mt-auto'>Get in touch with us</button>
          </div>
          {/* Third Card */}
          <div className='bg-white text-black border-black border-[1.5px] w-full rounded-lg p-6 flex flex-col justify-between'>
            <div className='pb-6'>
              <h1 className='font-Roboto font-bold text-center text-xl py-3'>Together, WE Rise and Secure</h1>
              <p className='mx-8 font-Roboto'>Finding Strength in unity, and paving the path to success in the security industry for women.</p>
            </div>
            <button className='text-white bg-gradient-to-l from-violet-800 to-orange-950 w-full rounded py-3 mt-auto'>Get to know us better</button>
          </div>
        </div>
      </section>

      <div id="aboutus" className='min-h-screen bg-gray-300 mx-28 text-black pt-3 pb-4'>
        <div className='flex justify-center gap-32 pt-9'>
          <h1 className='font-bold text-xl'>ABOUT US</h1>
          <p className='w-96'>This is a pioneering platform committed to empowering women in security through a dynamic mentorship program, access to education, and a supportive community. We are focused on creating a future where women can thrive, lead, and excel in the constantly evolving security landscape.</p>
        </div>

        <div className='bg-gradient-to-l from-orange-600 to-gray-950 m-9'>
          <section className='p-9 m-2'>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* First Card */}
              <div className="bg-white text-black border-black border-[1.5px] w-full rounded-lg mb-9 p-4 flex flex-col justify-between">
                <div>
                  <button className="text-white bg-gradient-to-l from-violet-800 to-orange-950 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                    <FaGlobe className="text-xl" />
                  </button>
                  <h1 className="font-Roboto font-bold text-center text-xl py-3">Mission</h1>
                  <p className="font-Roboto text-xl">Bridge the security gender gap through mentorship, cultivating confident women for impactful contributions.</p>
                </div>
              </div>

              {/* Second Card */}
              <div className="bg-white text-black border-black border-[1.5px] w-full rounded-lg mb-9 p-4 flex flex-col justify-between">
                <div>
                  <button className="text-white bg-gradient-to-l from-violet-800 to-orange-950 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                    <FaSearch className="text-xl" />
                  </button>
                  <h1 className="font-Roboto font-bold text-center py-3 text-xl">Vision</h1>
                  <p className="font-Roboto text-xl">Empowering women to lead and innovate in security, creating a future where gender equality thrives.</p>
                </div>
              </div>

              {/* Third Card */}
              <div className="bg-white text-black border-black border-[1.5px] w-full rounded-lg mb-9 p-4 flex flex-col justify-between">
                <div>
                  <button className="text-white bg-gradient-to-l from-violet-800 to-orange-950 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                    <FaUsers className="text-xl" />
                  </button>
                  <h1 className="font-Roboto font-bold text-center py-2 text-xl">What Sets Us Apart</h1>
                  <p className="font-Roboto text-xl">Holistic development, vibrant community engagement, and a rich resource hub set us apart, ensuring unparalleled support and growth for women in security.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div id="getus" className="flex justify-center gap-32">
          <div className="flex flex-col">
            <h1 className="font-bold text-xl mb-4">GET IN TOUCH</h1>
            <h2 className="mb-4">
              Need assistance or have feedback?<br />
              Drop us a line at <a href="mailto:info@cnf.gov.rw" className="text-blue-500">info@cnf.gov.rw</a>.<br />
              We're here to help and we appreciate hearing from you!
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <ul className="list-none flex flex-col items-start">
              <li className="flex items-center mb-2">
                <FaEnvelope className="mr-2" />
                <span>info@cnf.gov.rw</span>
              </li>
              <li className="flex items-center mb-2">
                <FaPhone className="mr-2" />
                <span>+250 788 350 035</span>
              </li>
              <li className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2" />
                <span>KN 3 Ave, Kigali, Rwanda</span>
              </li>
              <li className="flex items-center mb-2">
                <FaGlobe className="mr-2" />
                <span>Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        <h1 className="text-xl font-bold text-center pt-28">Our Socials</h1>
        <div className="flex items-center justify-center space-x-4 pt-5">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-violet-800 to-orange-600 rounded-full p-2">
            <FaLinkedin className="text-white text-2xl" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-violet-800 to-orange-600 rounded-full p-2">
            <FaFacebook className="text-white text-2xl" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-violet-800 to-orange-600 rounded-full p-2">
            <FaTwitter className="text-white text-2xl" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-violet-800 to-orange-600 rounded-full p-2">
            <FaInstagram className="text-white text-2xl" />
          </a>
        </div>
      </div>
    </div>
  );
}
