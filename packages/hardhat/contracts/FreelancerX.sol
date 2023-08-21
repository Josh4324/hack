// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
// 2. Imports

// 3. Interfaces, Libraries, Contracts
error NotJobOwner();
error NotEnoughFunds();
error JobHasBeenApproved();
error RatingMustBeGreaterThanZero();
error InsufficientBalance();
error LowRating();
error AlreadyVoted();
error VoteOnDisputeOngoing();

// 1. Create Freelancer Profile - Service Type, Rate Per Hour, Description, Username, Portfolio Link, Total Earned, Rating - Done
// 2. Create Job - Service Type, Amount, Description, Link to Job Requirement - Done
// 3. Display Job Board - Done
// 4. Apply 4 Job on Job Board - Multiple People can apply - Done - Not tested
// 5. Accept Freelancer Offer - Activate Escrow  - Done
// 6  Rate Freelance Over 5 - Done
// 7  Rate Client Over 5 - Not Sure
// 8  Activate Dispute Resolution - Not Done
// 9  Confirm Job Well done - Release Payment - Done
// 10 withdraw balance - Done

//11 - Update Total Earned - Done
//12 - Display Freelance Profile and Jobs Done
//14 - Display Clients Jobs - Done
//15 - Display Job Board - All available Job
//16 - Display Popular Freelancer - Earned a lot of money
//17 - Job application should be private
//18 - Display Amount of Jobs Done, Amount made, no of clients, no of freelancers
//19 - Issue Resoution - Done
//20 - Cancel Job offer - Done
//21 - Get Jobs Application under Job

/**
 * @title A sample Funding Contract
 * @author Joshua Adesanya
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FreelancerX {
    // Type Declarations

    // Structs
    struct Profile {
        uint256 id;
        string userName;
        string serviceType;
        uint256 ratePerHour;
        string serviceDescription;
        string portfolioLink;
        uint256 earned;
        uint256 rating;
        address usrAddr;
        uint256 balance;
        uint256 noOfRating;
    }

    struct Job {
        uint256 id;
        string serviceType;
        uint256 jobBudjet;
        string jobDescription;
        string linkToRequirement;
        bool status;
        address creator;
        address freelancer;
    }

    struct JobApp {
        uint256 id;
        uint256 jobId;
        string pitch;
        bool status;
        address applicant;
        uint256 duration;
    }

    struct Dispute {
        uint256 jobId;
        address intiator;
        string initator_reason;
        string reason;
        bool status;
        uint256 client;
        uint256 freelancer;
        uint256 duration;
    }

    struct JobCancel {
        uint256 jobId;
        bool client;
        bool freelancer;
    }

    // State variables
    uint256 private profileCount;
    uint256 private jobCount;
    uint256 private appCount;
    uint256 public constant PRECISION = 10 ** 18;
    uint256 public constant PERCENT = 10;

    uint256 private s_balance;
    mapping(address => Profile) private s_addressToProfile;
    mapping(uint256 => Job) private s_idToJob;
    mapping(uint256 => JobApp) private s_uintToJobApp;
    mapping(address => uint256) private s_addressToBalances;
    mapping(uint256 => Dispute) private s_disputes;
    mapping(uint256 => mapping(address => bool)) private s_disputes_vote;
    mapping(uint256 => JobCancel) private s_cancellation;

    // Events
    event FreelancerCreated(
        address indexed user,
        string userName,
        string serviceType,
        uint256 ratePerHour,
        string serviceDescription,
        string portfolioLink
    );

    event FreelancerUpdated(
        address indexed user,
        string userName,
        string serviceType,
        uint256 ratePerHour,
        string serviceDescription,
        string portfolioLink
    );

    event JobCreated(
        uint256 indexed id,
        string serviceType,
        uint256 jobBudjet,
        string jobDescription,
        string linkToRequirement,
        bool status,
        address creator,
        address freelancer
    );

    event JobUpdated(
        uint256 indexed id, string serviceType, uint256 jobBudjet, string jobDescription, string linkToRequirement
    );

    event JobApproved(uint256 indexed id, bool status);

    event JobAppCreated(
        uint256 indexed id, uint256 jobId, string pitch, bool status, address applicant, uint256 duration
    );

    event JobAppApproved(uint256 indexed id, bool status);
    event Withdraw(address addr, uint256 amount);
    event DisputeIntiated(
        uint256 jobId,
        address initiator,
        string initator_reason,
        string reason,
        bool status,
        uint256 client,
        uint256 freelancer,
        uint256 duration
    );
    event DisputeUpdated(uint256 jobId, string reason);

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor() {}

    /**
     * External Functions
     */

    /// @notice Create profile for new freelancer
    function createProfile(
        string calldata userName,
        string calldata serviceType,
        uint256 ratePerHour,
        string calldata serviceDescription,
        string calldata portfolioLink
    ) external {
        s_addressToProfile[msg.sender] = Profile(
            profileCount, userName, serviceType, ratePerHour, serviceDescription, portfolioLink, 0, 0, msg.sender, 0, 0
        );
        emit FreelancerCreated(msg.sender, userName, serviceType, ratePerHour, serviceDescription, portfolioLink);
        profileCount++;
    }

    /// @notice Update profile for freelancer
    function updateProfile(
        string calldata userName,
        string calldata serviceType,
        uint256 ratePerHour,
        string calldata serviceDescription,
        string calldata portfolioLink
    ) external {
        s_addressToProfile[msg.sender].userName = userName;
        s_addressToProfile[msg.sender].serviceType = serviceType;
        s_addressToProfile[msg.sender].ratePerHour = ratePerHour;
        s_addressToProfile[msg.sender].serviceDescription = serviceDescription;
        s_addressToProfile[msg.sender].portfolioLink = portfolioLink;
        emit FreelancerUpdated(msg.sender, userName, serviceType, ratePerHour, serviceDescription, portfolioLink);
    }

    /// @notice Create job for freelancers
    function createJob(
        string calldata serviceType,
        uint256 jobBudjet,
        string calldata jobDescription,
        string calldata linkToRequirement
    ) external {
        s_idToJob[jobCount] =
            Job(jobCount, serviceType, jobBudjet, jobDescription, linkToRequirement, false, msg.sender, address(0));
        emit JobCreated(
            jobCount, serviceType, jobBudjet, jobDescription, linkToRequirement, false, msg.sender, address(0)
        );
        jobCount++;
    }

    /// @notice Update job for freelancers
    function updateJob(
        uint256 jobId,
        string calldata serviceType,
        uint256 jobBudjet,
        string calldata jobDescription,
        string calldata linkToRequirement
    ) external {
        require(s_idToJob[jobId].creator == msg.sender, "Not Job Owner");
        s_idToJob[jobId].serviceType = serviceType;
        s_idToJob[jobId].jobBudjet = jobBudjet;
        s_idToJob[jobId].jobDescription = jobDescription;
        s_idToJob[jobId].linkToRequirement = linkToRequirement;
        emit JobUpdated(jobId, serviceType, jobBudjet, jobDescription, linkToRequirement);
    }

    function applyForJob(uint256 jobId, string calldata pitch, uint256 duration) external {
        s_uintToJobApp[appCount] = JobApp(appCount, jobId, pitch, false, msg.sender, duration);
        emit JobAppCreated(appCount, jobId, pitch, false, msg.sender, duration);
        appCount++;
    }

    function acceptJobApp(uint256 jobId, uint256 appId) external payable {
        if (s_idToJob[jobId].creator != msg.sender) {
            revert NotJobOwner();
        }

        if (s_idToJob[jobId].status != false) {
            revert JobHasBeenApproved();
        }

        if (msg.value < s_idToJob[jobId].jobBudjet) {
            revert NotEnoughFunds();
        }

        s_uintToJobApp[appId].status = true;
        s_idToJob[jobId].status = true;
        s_idToJob[jobId].freelancer = s_uintToJobApp[appId].applicant;
        s_balance = s_balance + s_idToJob[jobId].jobBudjet;

        emit JobApproved(jobId, true);
        emit JobAppApproved(appId, true);
    }

    function cancelJobApp(uint256 jobId) external {
        require(s_idToJob[jobId].creator == msg.sender, "Not creator");
        s_cancellation[jobId] = JobCancel(jobId, true, false);
    }

    function approveJobCancellation(uint256 jobId, uint256 appId, address client) external {
        require(s_idToJob[jobId].freelancer == msg.sender, "Not Freelancer");
        s_cancellation[jobId].freelancer = true;

        uint256 tenPercent = (s_idToJob[jobId].jobBudjet * 10) / 100;
        uint256 remain = s_idToJob[jobId].jobBudjet - tenPercent;

        s_uintToJobApp[appId].status = false;
        s_idToJob[jobId].status = false;
        s_addressToBalances[client] = s_addressToBalances[client] + remain;
        s_addressToBalances[s_idToJob[jobId].freelancer] = s_addressToBalances[s_idToJob[jobId].freelancer] + tenPercent;
        s_addressToProfile[s_idToJob[jobId].freelancer].balance =
            s_addressToProfile[s_idToJob[jobId].freelancer].balance + tenPercent;
        s_addressToProfile[s_idToJob[jobId].creator].balance =
            s_addressToProfile[s_idToJob[jobId].creator].balance + remain;
        s_idToJob[jobId].freelancer = address(0);
    }

    function initiateDispute(uint256 jobId, string calldata reason) external {
        uint256 duration = block.timestamp + 24 hours;
        s_disputes[jobId] = Dispute(jobId, msg.sender, reason, "", false, 0, 0, duration);
        emit DisputeIntiated(jobId, msg.sender, reason, "", false, 0, 0, duration);
    }

    function replyDispute(uint256 jobId, string calldata reason) external {
        s_disputes[jobId].reason = reason;
        emit DisputeUpdated(jobId, reason);
    }

    function voteOnDispute(uint256 jobId, uint256 voteId) external {
        if (s_addressToProfile[msg.sender].rating < 3) {
            revert LowRating();
        }
        if (s_disputes_vote[jobId][msg.sender] == true) revert AlreadyVoted();

        s_disputes_vote[jobId][msg.sender] = true;

        if (voteId == 0) {
            s_disputes[jobId].client = s_disputes[jobId].client + 1;
        } else if (voteId == 1) {
            s_disputes[jobId].freelancer = s_disputes[jobId].freelancer + 1;
        }
    }

    function resolveDispute(uint256 jobId, uint256 appId, address client, address freelancer) external {
        if (block.timestamp < s_disputes[jobId].duration) {
            revert VoteOnDisputeOngoing();
        }

        require(s_idToJob[jobId].creator == client, "incorrect client address");
        require(s_idToJob[jobId].freelancer == freelancer, "incorrect freelancer address");

        if (s_disputes[jobId].client > s_disputes[jobId].freelancer) {
            s_uintToJobApp[appId].status = false;
            s_idToJob[jobId].status = false;
            s_idToJob[jobId].freelancer = address(0);
            s_addressToBalances[client] = s_addressToBalances[client] + s_idToJob[jobId].jobBudjet;
        } else {
            s_addressToBalances[freelancer] = s_addressToBalances[freelancer] + s_idToJob[jobId].jobBudjet;
        }
    }

    function activatePayment(uint256 jobId, uint256 rating) external {
        if (s_idToJob[jobId].creator != msg.sender) {
            revert NotJobOwner();
        }

        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        s_addressToBalances[s_idToJob[jobId].freelancer] =
            s_addressToBalances[s_idToJob[jobId].freelancer] + s_idToJob[jobId].jobBudjet;
        s_addressToProfile[s_idToJob[jobId].freelancer].earned =
            s_addressToProfile[s_idToJob[jobId].freelancer].earned + s_idToJob[jobId].jobBudjet;
        s_addressToProfile[s_idToJob[jobId].freelancer].balance =
            s_addressToProfile[s_idToJob[jobId].freelancer].balance + s_idToJob[jobId].jobBudjet;

        uint256 weightedSum = (
            s_addressToProfile[s_idToJob[jobId].freelancer].rating
                * s_addressToProfile[s_idToJob[jobId].freelancer].noOfRating
        ) + rating;

        s_addressToProfile[s_idToJob[jobId].freelancer].noOfRating += 1;
        s_addressToProfile[s_idToJob[jobId].freelancer].rating =
            weightedSum / s_addressToProfile[s_idToJob[jobId].freelancer].noOfRating;
    }

    function withdrawFund(uint256 amount) public {
        if (s_addressToBalances[msg.sender] < amount) {
            revert InsufficientBalance();
        }

        s_balance = s_balance - amount;
        s_addressToBalances[msg.sender] = s_addressToBalances[msg.sender] - amount;
        s_addressToProfile[msg.sender].balance = s_addressToProfile[msg.sender].balance - amount;
        (bool success,) = (msg.sender).call{value: amount}("");
        require(success, "Failed to send funds");
        emit Withdraw(msg.sender, amount);
    }

    function fetchJobs() public view returns (Job[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < jobCount; i++) {
            itemCount += 1;
        }

        Job[] memory items = new Job[](itemCount);

        for (uint256 i = 0; i < jobCount; i++) {
            uint256 currentId = i;

            Job storage currentItem = s_idToJob[currentId];
            items[currentIndex] = currentItem;

            currentIndex += 1;
        }
        return items;
    }

    function getProfile(address addr) public view returns (Profile memory) {
        return s_addressToProfile[addr];
    }

    function getJob(uint256 id) public view returns (Job memory) {
        return s_idToJob[id];
    }

    function getApplications(uint256 id) public view returns (JobApp memory) {
        return s_uintToJobApp[id];
    }

    function getDispute(uint256 id) public view returns (Dispute memory) {
        return s_disputes[id];
    }

    function fetchApplications(uint256 id) public view returns (JobApp[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < appCount; i++) {
            if (s_uintToJobApp[i].jobId == id) {
                itemCount += 1;
            }
        }

        JobApp[] memory items = new JobApp[](itemCount);

        for (uint256 i = 0; i < appCount; i++) {
            if (s_uintToJobApp[i].jobId == id) {
                uint256 currentId = i;

                JobApp storage currentItem = s_uintToJobApp[currentId];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function getInfo() public view returns (uint256, uint256, uint256) {
        return (profileCount, jobCount, appCount);
    }
}
