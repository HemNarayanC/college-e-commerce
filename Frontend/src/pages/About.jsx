
import React from "react";
import { FaUsers, FaBullseye, FaHeart, FaLightbulb } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center py-16 bg-white rounded-lg shadow-md mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            About Our Company
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are a passionate team dedicated to creating innovative solutions
            that empower businesses and individuals to thrive in the digital
            world.
          </p>
        </section>

        {/* Our Story Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Story
              </h2>
              <p className="text-gray-700 mb-4">
                Founded in 2023, our company was born out of a shared vision to
                revolutionize the e-commerce landscape. We noticed a gap in the
                market for a truly integrated platform that seamlessly connects
                vendors, customers, and products in a single, intuitive
                ecosystem.
              </p>
              <p className="text-gray-700">
                Since then, we have been on a mission to build a platform that
                is not only powerful and feature-rich but also accessible and
                user-friendly for everyone.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Our Team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt="Team Member 1"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                John Doe
              </h3>
              <p className="text-gray-500">CEO & Founder</p>
            </div>
            {/* Team Member 2 */}
            <div className="text-center">
              <img
                src="https://i.pravatar.cc/150?img=2"
                alt="Team Member 2"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Jane Smith
              </h3>
              <p className="text-gray-500">Chief Technology Officer</p>
            </div>
            {/* Team Member 3 */}
            <div className="text-center">
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="Team Member 3"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Peter Jones
              </h3>
              <p className="text-gray-500">Lead Designer</p>
            </div>
            {/* Team Member 4 */}
            <div className="text-center">
              <img
                src="https://i.pravatar.cc/150?img=4"
                alt="Team Member 4"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Sarah Williams
              </h3>
              <p className="text-gray-500">Marketing Director</p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-white rounded-lg shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white mx-auto mb-4">
                  <FaUsers size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Customer First
                </h3>
                <p className="text-gray-600">
                  We believe in putting our customers at the heart of
                  everything we do.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white mx-auto mb-4">
                  <FaBullseye size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Integrity
                </h3>
                <p className="text-gray-600">
                  We are committed to honesty, transparency, and ethical
                  conduct in all our dealings.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white mx-auto mb-4">
                  <FaHeart size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Passion
                </h3>
                <p className="text-gray-600">
                  We are passionate about our work and dedicated to delivering
                  excellence.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white mx-auto mb-4">
                  <FaLightbulb size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  We constantly strive to innovate and push the boundaries of
                  what is possible.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
