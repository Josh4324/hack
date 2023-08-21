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

export default function Profile() {
  const { address } = useAccount();
  const ratingRef = useRef();
  const amountRef = useRef();

  const [profile, setProfile] = useState({});
  const [apps, setApps] = useState([]);
  const [apps1, setApps1] = useState([]);
  const [job, setJob] = useState({});

  const createWriteContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const payContract = new ethers.Contract(
      freelanceAddress,
      freelancerABI.abi,
      signer
    );
    return payContract;
  };

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

  const getProfile = async () => {
    const { ethereum } = window;
    const contract = await createWriteContract();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await provider.listAccounts();
    const profile = await contract.getProfile(accounts[0]);
    console.log(profile);
    setProfile(profile);
  };

  const getJobs = async () => {
    const contract = await createReadContract();
    const data = await contract.fetchJobs();

    const filterData = data.filter((item) => item.creator === address);
    console.log("fil", filterData);

    let items = await Promise.all(
      filterData.map(async (i) => {
        const apps = await contract.fetchApplications(i?.id);

        //const tokenUri = await contract.tokenURI(i.tokenId);
        //const meta = await axios.get(tokenUri);
        //const newmeta = JSON.stringify(meta.data).replace(/\\/g, "");
        //console.log("new", newmeta);
        //console.log(JSON.parse(JSON.stringify(meta.data)).name);
        //let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        return [...apps];
      })
    );

    let applications = await Promise.all(
      data.map(async (i) => {
        const apps = await contract.fetchApplications(i?.id);

        //const tokenUri = await contract.tokenURI(i.tokenId);
        //const meta = await axios.get(tokenUri);
        //const newmeta = JSON.stringify(meta.data).replace(/\\/g, "");
        //console.log("new", newmeta);
        //console.log(JSON.parse(JSON.stringify(meta.data)).name);
        //let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        return [...apps];
      })
    );

    const items2 = [].concat(...items);
    const applications2 = [].concat(...applications);

    const filteredApp = applications2.filter(
      (item) => item.applicant === address
    );

    setApps(items2);
    setApps1(filteredApp);
    console.log("items", items);
  };

  const approve = async (evt, jobId, appId, amount) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const data = await contract.getJob(jobId);
    const job = Number(ethers.BigNumber.from(jobId));
    const app = Number(ethers.BigNumber.from(appId));

    console.log(job, app);
    console.log(amount);

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.acceptJobApp(job, app, {
        value: data.jobBudjet,
      });

      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const confirm = async (evt, jobId, rating) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const job = Number(ethers.BigNumber.from(jobId));

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.activatePayment(job, rating);

      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const withdraw = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const id = toast.loading("Transaction in progress..");
    const amount = ethers.utils.parseEther(amountRef.current.value);

    try {
      const tx = await contract.withdrawFund(amount);

      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  useEffect(() => {
    getProfile();
    getJobs();
  }, []);

  return (
    <div>
      <div>
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
          <div className=" mb-10 ml-auto w-fit">
            <ConnectButton />
          </div>

          <div className="w-1/2 mr-auto">
            <div>
              <input
                ref={amountRef}
                className="w-1/2 pl-2 py-4 text-black rounded"
                placeholder="Enter Amount"
              />
            </div>

            <button
              onClick={withdraw}
              className="text-white text-lg mt-5 bg-black px-3 py-3 rounded"
            >
              Withdraw
            </button>
          </div>
          <form className="w-full mt-[65px] flex flex-col gap-[30px]">
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Your UserName
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.userName}
                  placeholder="John Doe"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Service Type
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.serviceType}
                  placeholder="Write a title"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Total Earned
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.earned / 10 ** 18}
                  placeholder="John Doe"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Rating
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.rating}
                  placeholder="Write a title"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Wallet Address
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.usrAddr}
                  placeholder="John Doe"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Current Balance
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.balance / 10 ** 18}
                  placeholder="Write a title"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Rate Per Hour
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.ratePerHour}
                  placeholder="10 dollar"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Portfolio Link
                </span>

                <input
                  required
                  step="0.1"
                  defaultValue={profile?.portfolioLink}
                  placeholder="Enter Portfolio Link"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>

            <label className="flex-1 w-full flex flex-col">
              <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                Describe Service
              </span>

              <textarea
                required
                defaultValue={profile?.serviceDescription}
                rows={10}
                placeholder="Describe what you do"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
              />
            </label>
          </form>

          <div className="w-full mt-[65px] flex flex-col gap-[30px]">
            <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
              Applications From Job Posted
            </h1>

            <div className="flex justify-between flex-wrap mt-10 text-white">
              {apps.map((item) => {
                return (
                  <div
                    key={item?.id}
                    className="w-5/12 mr-5 bg-black mt-5  px-5  py-10 flex justify-between rounded-2xl"
                  >
                    <div className="w-3/4  ">
                      <div className="font-bold">Job ID</div>
                      <div className="text-sm mb-5">
                        {Number(ethers.BigNumber.from(item?.jobId))}
                      </div>
                      <div className="font-bold">Pitch</div>
                      <div className="text-sm mb-5">{item?.pitch}</div>
                      <div className="font-bold">Status</div>
                      <div className="text-sm">
                        {item?.status ? "Approved" : "Pending"}
                      </div>
                    </div>

                    <div className="w-1/2">
                      <div className="font-bold">Applicant</div>
                      <div className="text-sm mb-5">
                        {item?.applicant?.slice(0, 8)}...
                        {item.applicant?.slice(item.applicant?.length - 6)}
                      </div>
                      <div className="font-bold">Duration</div>
                      <div className="text-sm mb-5">
                        {Number(ethers.BigNumber.from(item?.duration))}
                      </div>{" "}
                      <button
                        onClick={(evt) =>
                          approve(evt, item?.jobId, item?.id, item?.amount)
                        }
                        className="block"
                      >
                        Approve
                      </button>
                      {item?.status ? (
                        <div className="mt-5 ">
                          <input
                            className="text-sm py-3 text-black px-3 w-full"
                            ref={ratingRef}
                            placeholder="Rating(1 - 5)"
                          />
                          <button
                            onClick={(evt) =>
                              confirm(evt, item?.jobId, ratingRef.current.value)
                            }
                            className="block mt-2"
                          >
                            Confirm Payment
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full mt-[65px] flex flex-col gap-[30px]">
            <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
              Job Applications
            </h1>

            <div className="flex justify-between flex-wrap mt-10 text-white">
              {apps1.map((item) => {
                return (
                  <div
                    key={item?.id}
                    className="w-5/12 mr-5 bg-black mt-5  px-5  py-10 flex justify-between rounded-2xl"
                  >
                    <div className="w-3/4  ">
                      <div className="font-bold">Job ID</div>
                      <div className="text-sm mb-5">
                        {Number(ethers.BigNumber.from(item?.jobId))}
                      </div>
                      <div className="font-bold">Pitch</div>
                      <div className="text-sm mb-5">{item?.pitch}</div>
                      <div className="font-bold">Status</div>
                      <div className="text-sm">
                        {item?.status ? "Approved" : "Pending"}
                      </div>
                    </div>

                    <div className="w-1/2">
                      <div className="font-bold">Applicant</div>
                      <div className="text-sm mb-5">
                        {item?.applicant?.slice(0, 8)}...
                        {item.applicant?.slice(item.applicant?.length - 6)}
                      </div>
                      <div className="font-bold">Duration</div>
                      <div className="text-sm mb-5">
                        {Number(ethers.BigNumber.from(item?.duration))}
                      </div>{" "}
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
