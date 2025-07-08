import React from "react";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionPromo1 from "@/components/SectionPromo1";
import SectionHero2 from "@/components/SectionHero/SectionHero2";
import SectionSliderLargeProduct from "@/components/SectionSliderLargeProduct";
import SectionSliderProductCard from "@/components/SectionSliderProductCard";
import DiscoverMoreSlider from "@/components/DiscoverMoreSlider";
import SectionGridMoreExplore from "@/components/SectionGridMoreExplore/SectionGridMoreExplore";
import SectionPromo2 from "@/components/SectionPromo2";
import SectionSliderCategories from "@/components/SectionSliderCategories/SectionSliderCategories";
import SectionPromo3 from "@/components/SectionPromo3";
import SectionClientSay from "@/components/SectionClientSay/SectionClientSay";
import Heading from "@/components/Heading/Heading";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { PRODUCTS, SPORT_PRODUCTS } from "@/data/data";
import SectionGridFeatureItems from "@/components/SectionGridFeatureItems";
import SectionMagazine5 from "@/app/blog/SectionMagazine5";
import MoreExperiencesSection from "@/components/MoreExperiences";
import BaptismAndBabyShowerSection from "@/components/BabySection";
import HowGiftListWorksSection from "@/components/HowItWorks";
import ShopTheLookSection from "@/components/ShopTheLook";
import ShopByDepartmentSection from "@/components/ShopByDepartment"
import RichTextSection from "@/components/RichText";

function PageHome() {
  return (
    <div className="nc-PageHome relative overflow-hidden">
      {/* Hero FULL WIDTH */}
      <SectionHero2 />
      <RichTextSection/>

      {/* Discover More FULL WIDTH */}
      <div className="mt-24 lg:mt-10 space-y-6 my-12 lg:space-y-8 lg:my-20">
        <div className="container" style={{ maxWidth: "1736px" }}>
          <DiscoverMoreSlider />
        </div>
      </div>
      <div className="container space-y-6 my-12 lg:space-y-8 lg:my-20" style={{ maxWidth: "1736px" }}>
      <MoreExperiencesSection />
      <SectionPromo3 />
      </div>
      <div className="container space-y-6 my-12 lg:space-y-8 lg:my-20" style={{ maxWidth: "1920px" }}>
         <BaptismAndBabyShowerSection />
      </div>
      <div className="container mt-24 mb-24 space-y-6 my-12 lg:space-y-8 lg:my-20" style={{ maxWidth: "1736px" }}>
        <HowGiftListWorksSection />
      </div>
      <div className="container mt-24 space-y-6 my-12 lg:space-y-8 lg:my-20" style={{ maxWidth: "1736px" }}>
          <ShopTheLookSection />
      </div>
      <div className="container mt-24 space-y-6 my-12 lg:space-y-8 lg:my-20" style={{ maxWidth: "1736px" }}>
         <ShopByDepartmentSection/>
      </div>
      
      
      {/* Future sections, also inside container */}
      {/* 
      <div className="container space-y-24 my-24 lg:space-y-32 lg:my-32">
        <SectionSliderProductCard data={[PRODUCTS[4], SPORT_PRODUCTS[5], PRODUCTS[7], SPORT_PRODUCTS[1], PRODUCTS[6]]} />
        <SectionHowItWork />
        <SectionPromo1 />
        <SectionGridMoreExplore />
        <SectionPromo2 />
        <SectionSliderLargeProduct cardStyle="style2" />
        <SectionSliderCategories />
        <SectionGridFeatureItems />
        <div>
          <Heading rightDescText="From the Ciseco blog">The latest news</Heading>
          <SectionMagazine5 />
          <div className="flex mt-16 justify-center">
            <ButtonSecondary>Show all blog articles</ButtonSecondary>
          </div>
        </div>
        <SectionClientSay />
      </div>
      */}
    </div>
  );
}

export default PageHome;
