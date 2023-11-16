import { Button } from "@/components/ui/button";
import { LoginComponent } from "@/components/ui/bankcomponents/logincomponent";
import { AnimatePresence, motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { AreaChartIcon, ArrowRight, PlusSquare } from "lucide-react";
import { useContext, useState } from "react";
import { CheckingAccount } from "@/components/ui/bankcomponents/checkingview";
import { CreditAccount } from "@/components/ui/bankcomponents/creditview";
import { MorgtgageAccount } from "@/components/ui/bankcomponents/mortgageview";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { checkData } from "@/lib/checkingdata";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

import LoginContext from "@/utils/contexts/login";
import { FederatedCheckingAccount } from "@/components/ui/bankcomponents/federatedChecking";
import { FederatedCreditAccount } from "@/components/ui/bankcomponents/federatedCredit";
import NavBar from "@/components/ui/navbar";
import BankInfoCard from "@/components/ui/bankcomponents/bankInfoCard";
import { BounceLoader } from "react-spinners";

export default function Bank() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAIResponse] = useState<string>("");
  const [federatedAccountOne, setFederatedAccountOne] = useState(false);
  const [federatedAccountTwo, setFederatedAccountTwo] = useState(false);
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } = useContext(LoginContext);

  function goAirways() {
    router.push("/airways");
  }

  const { wealthManagement, aiFinancial, federatedAccounts } = useFlags();

  const money = JSON.stringify(checkData);

  const prompt: string = `Playing the role of a financial analyst, using the data contained within this information set: ${money}, write me 50 word of an analysis of the data and highlight the item I spend most on. Skip any unnecessary explanations. Summarize the mostly costly area im spending at. Your response should be tuned to talking directly to the requestor.`;

  async function submitQuery(query: any) {
    try {
      console.log(prompt);
      setLoading(true);
      const response = await fetch("/api/bedrock", {
        method: "POST",
        body: JSON.stringify({ prompt: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
      }

      const data = await response.json();
      setAIResponse(data.completion);
      console.log(data.completion);
      return data.completion;
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  const data = [
    { month: "05/23", balance: 18427 },
    { month: "06/23", balance: 25345 },
    { month: "07/23", balance: 32647 },
    { month: "08/23", balance: 47954 },
    { month: "09/23", balance: 64234 },
    { month: "10/23", balance: 83758 },
  ];

  const pageVariants = {
    initial: { x: "100%" },
    in: { x: 0 },
    out: { x: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const variants = {
    hidden: { scaleY: 0, originY: 1 }, // start from the base of the div
    visible: { scaleY: 1, originY: 1 }, // grow up to the top of the div
  };

  const ldclient = useLDClient();

  function handleLogout() {
    logoutUser();
    const context: any = ldclient?.getContext();
    context.user.tier = null;
    ldclient?.identify(context);
    setCookie("ldcontext", context);
  }

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.main
          className={`relative w-full h-screen font-audimat`}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="flex h-20 shadow-2xl bg-ldgrey ">
            <NavBar variant={"bank"} />
          </div>
          <div className="h-2/5 w-full bg-bankblue ">
            <div className="w-full py-14 px-12 xl:px-32 2xl:px-[300px] 3xl:px-[400px] flex justify-between">
              <div className="flex flex-col text-white w-1/3 justify-start">
                <img src="ToggleBankHeader.png" width={52} className="pb-8" />
                <p className="text-2xl lg:text-6xl 3xl:text-[112px] font-audimat">Welcome to</p>
                <p className="text-xl lg:text-6xl 3xl:text-[112px] font-audimat">Toggle Bank</p>
                <p className="text-xl lg:text-2xl 3xl:text-4xl font-sohnelight pt-8">
                  Login to access your account
                </p>
              </div>
              <div className="flex justify-end pr-30">
                <LoginComponent
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loginUser={loginUser}
                />
              </div>
            </div>
          </div>

          <section className="w-3/4 flex font-sohnelight text-center justify-center mx-auto space-x-24 pt-24">
            <div className="grid items-center justify-items-center">
              <img src="Checking.png" width={96} className="pb-2" />
              {/* <Banknote size={96} strokeWidth={1} className="pb-2" /> */}
              <p className="text-2xl ">Checking</p>
            </div>
            <div className="grid items-center justify-items-center">
              <img src="Business.png" width={96} className="pb-2" />
              {/* <PiggyBank size={96} strokeWidth={1} className="pb-2" /> */}
              <p className="text-2xl ">Business</p>
            </div>
            <div className="grid items-center justify-items-center">
              <img src="Credit.png" width={96} className="pb-2" />
              {/* <CreditCard size={96} strokeWidth={1} className="pb-2" /> */}
              <p className="text-2xl ">Credit Cards</p>
            </div>
            <div className="grid items-center justify-items-center">
              <img src="Savings.png" width={96} className="pb-2" />
              {/* <Home size={96} strokeWidth={1} className="pb-2" /> */}
              <p className="text-2xl ">Savings</p>
            </div>
            <div className="grid items-center justify-items-center">
              <img src="Mortgage.png" width={96} className="pb-2" />
              {/* <CandlestickChart size={96} strokeWidth={1} className="pb-2" /> */}
              <p className="text-2xl ">Mortgages</p>
            </div>
          </section>

          <section
            className="flex flex-col gap-y-8 sm:gap-y-8 sm:flex-row sm:gap-x-6 lg:gap-x-14
           mx-auto py-12 justify-center px-4 lg:px-8"
          >
            <BankInfoCard
              imgSrc="House.png"
              headerTitleText="Home Mortgages"
              subtitleText="Toggle the light on and come home. Were here to help."
              key={1}
            />
            <BankInfoCard
              imgSrc="Smoochy.png"
              headerTitleText="Wealth Management"
              subtitleText="Use next generation tooling to ensure your future is safe."
              key={1}
            />
            <BankInfoCard
              imgSrc="Cards.png"
              headerTitleText="Sign Up For Toggle Card"
              subtitleText="Special offers for our most qualified members. Terms apply."
              key={1}
            />
          </section>
        </motion.main>
      ) : (
        <motion.main
          className={`relative w-full font-roboto pb-20`}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <NavBar variant={"bank"} handleLogout={handleLogout} />

          <div className=" w-full px-8 ">
            <div className={`flex flex-col xl:flex-row py-8 ${federatedAccounts ? "gap-x-8" : ""}`}>
              <div className="flex w-full h-[425px]">
                <div className="px-6 shadow-xl bg-gradient-blue w-full">
                  <div className="justify-center xl:justify-start">
                    <div>
                      <p className="text-white font-sohne py-6 text-[24px]">Account Summary</p>
                    </div>
                    <div className="flex flex-row gap-4">
                      <div className="p-4 h-[300px] w-1/3  bg-white ">
                        <CheckingAccount wealthManagement={wealthManagement} />
                      </div>
                      <div className="p-4 h-[300px] w-1/3  bg-white">
                        <CreditAccount />
                      </div>
                      <div className="p-4 h-[300px] w-1/3 bg-white">
                        <MorgtgageAccount />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-grow font-sohne h-full">
                {federatedAccounts && (
                  <div className="h-full">
                    <div className="px-6 gap-4 w-full bg-ldcardgrey  h-[425px]">
                      <div>
                        <p className="text-black font-sohne py-6 text-[24px]">
                          Federated Account Access
                        </p>
                      </div>
                      <div className="flex flex-row gap-4 justify-start">
                        {!federatedAccountOne ? (
                          <div
                            onClick={() => setFederatedAccountOne(true)}
                            className="flex p-4 h-[300px] w- bg-white items-center "
                          >
                            <PlusSquare size={96} className="text-gray-400 mx-auto" />
                          </div>
                        ) : (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={variants}
                            transition={{ duration: 0.5 }}
                            className="p-4 h-[300px] w-[250px] bg-white "
                          >
                            <FederatedCheckingAccount />
                          </motion.div>
                        )}

                        {!federatedAccountTwo ? (
                          <div
                            onClick={() => setFederatedAccountTwo(true)}
                            className="flex p-4 h-[300px] w-[250px] bg-white items-center "
                          >
                            <PlusSquare size={96} className="text-gray-400 mx-auto" />
                          </div>
                        ) : (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={variants}
                            transition={{ duration: 0.5 }}
                            className="p-4 h-[300px] w-[250px] bg-white"
                          >
                            <FederatedCreditAccount />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {wealthManagement ? (
              <div className="px-6 py-2 bg-ldcardgrey h-[425px] shadow-2xl">
                <div>
                  <p className="text-black font-sohne py-6 text-[24px]">Wealth Management</p>
                </div>
                <div className="grid grid-cols-5 gap-4 w-full h-[300px]">
                  {aiFinancial && (
                    <div className="relative p-4 col-span-2 w-full max-h-[300px] bg-white ">
                      <div className="">
                        <div className="flex  justify-between pb-2">
                          <div>
                            <p className="aiinsightstext pb-1">
                              Wealth Insights{" "}
                              <span className="accountsecondary">AI Powered By AWS Bedrock</span>
                            </p>
                          </div>

                          <div>
                            <img src="aws.png" />
                          </div>
                        </div>
                        <div className="absolute bottom-5 right-5">
                          <Button
                            onClick={() => {
                              submitQuery(prompt);
                            }}
                            className="flex text-xl bg-transparent font-sohnelight hover:bg-transparent hover:text-blue-700 hover:scale-110 text-blue-700 items-center"
                          >
                            Generate <ArrowRight className="text-blue-700 ml-2" />
                          </Button>
                        </div>
                      </div>
                      <div className="overflow-auto h-[150px] flex justify-center items-center">
                        {loading ? (
                          <BounceLoader color="#1D4ED8" size={100} />
                        ) : (
                          <p className="my-4 font-sohnelight">{aiResponse}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-6 bg-white col-span-1 max-h-[300px] h-full">
                    <div className="space-y-2">
                      <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
                        <AreaChartIcon className="text-blue-700" />
                      </div>
                      <div className="">
                        <p className="accounttext">Brokerage Account (***6552)</p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="pt-16">
                        <p className="cardaccounttext">Total Investment Balance: </p>
                        <p className="moneytext">$184,278</p>
                        <p className="accountsecondary">Over Lifetime of Account</p>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <div
                    className={`flex flex-col p-4 w-full max-h-[300px] bg-white justify-center ${
                      aiFinancial ? "col-span-2" : "col-span-4"
                    }`}
                  >
                    <p className="aiinsightstext">6-Month Account Trend</p>
                    <ResponsiveContainer>
                      <AreaChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="balance"
                          stroke="#8884d8"
                          fill="url(#colorUv)"
                        />

                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00c0e7" stopOpacity={1} />
                            <stop offset="95%" stopColor="#a34fde" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-row w-full h-[425px] py-2 items-center space-x-20 justify-center">
              <img src="CC.png" />
              <img src="Loan.png" />
            </div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
