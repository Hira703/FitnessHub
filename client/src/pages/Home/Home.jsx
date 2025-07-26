import React from 'react';
import Banner from './Banner';
import NewsletterForm from './NewsletterForm';
import FeaturedSection from './FeaturedSection';
import AboutSection from './AboutSection';
import FeaturedClassesSection from './FeaturedClassesSection';
import TestimonialsCarousel from './TestimonialsCarousel';
import LatestForumPosts from './LatestForumPosts';
import TeamSection from './TeamSection';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <>
         <Helmet>
        <title>Home</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
        <div>
           <Banner></Banner> 
           <FeaturedSection></FeaturedSection>
           <AboutSection></AboutSection>
           <FeaturedClassesSection></FeaturedClassesSection>
           <TestimonialsCarousel></TestimonialsCarousel>
           <LatestForumPosts></LatestForumPosts>
           <TeamSection></TeamSection>
           <NewsletterForm></NewsletterForm>
        </div>
        </>
    );
};

export default Home;