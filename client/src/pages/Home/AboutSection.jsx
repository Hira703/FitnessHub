import React from "react";
import aboutImg from "../../assets/images/about.avif";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const AboutSection = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#F9FAFB] rounded-3xl shadow-xl p-6 md:p-10 flex flex-col lg:flex-row items-center gap-10 transition duration-300">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <img
              src={aboutImg}
              alt="About Us"
              className="rounded-2xl shadow-md w-full h-[320px] md:h-[400px] object-cover"
            />
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#1D4ED8]">
              Empowering Your Fitness Journey 💪
            </h2>
            <p className="text-md mb-6 leading-relaxed text-gray-600">
              At <span className="font-semibold text-[#F59E0B]">FitSphere</span>, we’re more than just a fitness platform.
              We are a <span className="text-[#EF4444] font-semibold">community-driven ecosystem</span> designed to help you stay consistent,
              motivated, and goal-focused. Whether you're a beginner or a seasoned athlete, our certified trainers and intelligent tracking tools
              are tailored to help you crush your fitness goals — one session at a time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "500+ Members", color: COLORS[0] },
                { title: "30+ Expert Trainers", color: COLORS[1] },
                { title: "1000+ Classes Booked", color: COLORS[2] },
                { title: "24/7 Support", color: COLORS[3] },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border p-4 shadow-sm flex items-center gap-3 bg-white hover:shadow-md transition duration-300"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span
                    className="font-medium"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
