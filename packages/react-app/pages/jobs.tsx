/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import freelancerABI from "../abis/freelancer.json";
import { toast } from "react-toastify";
import Link from "next/link";
import { freelanceAddress } from "../constants/index";

export default function Jobs() {
  const [jobData, setJobs] = useState([]);

  const createReadContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const payContract = new ethers.Contract(
      freelanceAddress,
      freelancerABI.abi,
      provider
    );
    return payContract;
  };

  const getJobs = async () => {
    const contract = await createReadContract();
    const data = await contract.fetchJobs();
    setJobs(data);
    console.log(data);
  };

  useEffect(() => {
    getJobs();
  }, []);
  return (
    <div>
      <div className="">
        <div>
          <div>
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
              <div className=" mb-10 ml-auto w-fit">
                <ConnectButton />
              </div>

              <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                  Job Board
                </h1>
              </div>
            </div>

            <div className="flex mt-10 text-white flex-wrap justify-between">
              {jobData.map((item) => {
                return (
                  <div
                    key={item?.id}
                    className="w-5/12  mr-5 bg-black  px-5 mt-6  py-10 flex justify-between rounded-2xl"
                  >
                    <div className="w-3/4  ">
                      <div className="font-bold">Service Type</div>
                      <div className="text-sm mb-5">{item?.serviceType}</div>
                      <div className="font-bold">Service Description</div>
                      <div className="text-sm mb-5">{item?.jobDescription}</div>
                      <div className="font-bold">Budget</div>
                      <div className="text-sm">
                        {ethers.BigNumber.from(item?.jobBudjet) / 10 ** 18}
                      </div>
                    </div>

                    <div className="w-1/2">
                      <div className="font-bold">Link to Requirement</div>
                      <div className="text-sm mb-5">
                        <a href={item?.linkToRequirement}>
                          <div>Link to Requirement</div>
                        </a>
                      </div>
                      <div className="font-bold">Job Owner</div>
                      <div className="text-sm mb-5">
                        {" "}
                        {item?.creator?.slice(0, 8)}...
                        {item.creator?.slice(item.creator?.length - 6)}
                      </div>{" "}
                      <Link href={`/job/${item?.id}`}>
                        <button className="block mb-5">More Details</button>
                      </Link>
                      <Link href={`/apply/${item?.id}`}>
                        <button className="block">Apply</button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
