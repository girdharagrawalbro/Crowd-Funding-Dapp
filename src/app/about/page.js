"use client";
import React from 'react';
import Circle from "../components/Circle";

export default function About() {
    return (
        <div className="relative min-h-screen py-8 md:py-10">
            <Circle />                
            
            <div className="z-10 max-w-4xl mx-auto px-4 sm:px-6">
                <h1 className="text-3xl md:text-4xl theme-text font-bold text-center mb-6 md:mb-8">
                    About Our Crowdfunding Platform
                </h1>

                <section className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl theme-text font-semibold mb-3 md:mb-4">Our Mission</h2>
                    <p className="leading-relaxed theme-text text-sm md:text-base">
                        Our mission is to empower creators, innovators, and dreamers by providing a platform where they can bring their ideas to life. We believe that great ideas deserve to be realized, and we are here to help you connect with a community that shares your vision.
                    </p>
                </section>

                <section className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl theme-text font-semibold mb-3 md:mb-4">How It Works</h2>
                    <p className="leading-relaxed theme-text text-sm md:text-base">
                        Our platform makes it easy for anyone to start a crowdfunding campaign. Simply create a project, set your funding goal, and share your story with the world. Backers can support your project by contributing funds, and in return, they often receive unique rewards or early access to your product.
                    </p>
                </section>

                <section className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl theme-text font-semibold mb-3 md:mb-4">Our Team</h2>
                    <p className="leading-relaxed theme-text text-sm md:text-base">
                        We are a passionate team of developers, designers, and entrepreneurs who are dedicated to making crowdfunding accessible to everyone. Our goal is to create a seamless experience for both creators and backers, ensuring that every project has the best chance of success.
                    </p>
                </section>

                <section className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl theme-text font-semibold mb-3 md:mb-4">Join Us</h2>
                    <p className="leading-relaxed theme-text text-sm md:text-base">
                        Whether {"you're"} a creator with a groundbreaking idea or a backer looking to support the next big thing, we invite you to join our community. Together, we can make dreams come true.
                    </p>
                </section>
            </div>
        </div>
    );
}