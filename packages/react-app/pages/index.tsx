/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect, useRef } from "react";
import freelancerABI from "../abis/freelancer.json";
import { ethers } from "ethers";
import { freelanceAddress } from "../constants/index";

export default function Home() {
  const [data, setData] = useState([]);

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const payContract = new ethers.Contract(
      freelanceAddress,
      freelancerABI.abi,
      signer
    );
    return payContract;
  };

  const getInfo = async () => {
    const contract = await createWriteContract();
    const data = await contract.getInfo();
    setData(data);
    console.log(data);
  };

  useEffect(() => {
    getInfo();
  }, []);
  return (
    <div>
      <div className="flex w-full w-2/12 justify-between ml-auto">
        <Link href="/register">
          <div className="text-white">Register</div>
        </Link>
        <Link href="/job">
          <div className="text-white">Post a Job</div>
        </Link>
      </div>

      <div className="text-white font-extrabold text-6xl mt-40 text-center">
        FreelancerX
      </div>
      <div className="text-white font-extrabold text-6xl mt-4 text-center">
        Building Dreams, Delivering Results
      </div>
      <div className="text-center text-white mt-4 text-xl">
        Where clients find the perfect freelancer for their project and
        Freelancers get paid for their skills
      </div>

      {data.length > 0 ? (
        <div className="flex justify-between mt-10 text-lg w-1/2 mx-auto">
          <div className="text-white">
            {Number(ethers.BigNumber.from(data[0]))} Users
          </div>
          <div className="text-white">
            {Number(ethers.BigNumber.from(data[1]))} Jobs
          </div>
          <div className="text-white">
            {Number(ethers.BigNumber.from(data[2]))} Application
          </div>
        </div>
      ) : null}

      <Link href="/jobs">
        <div className="text-center text-white mt-20 text-2xl bg-black w-1/3 mx-auto py-6">
          Job Board
        </div>
      </Link>

      <div className="mt-20 mx-auto w-fit">
        <ConnectButton />
      </div>
    </div>
  );
}
