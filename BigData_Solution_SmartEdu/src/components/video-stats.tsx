"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ArrowsPointingOutIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { SVGProps, useEffect, useRef, useState } from "react";
import Placeholder from "@/assets/placeholder.jpeg";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

const ImageMotion = motion(Image);

export default function VideoStats({ hash }: { hash: string }) {
  const router = useRouter();
  const [videoData, setVideoData] = useState({});
  const [emotions, setEmotions] = useState([]);
  const [imagesLinks, setImagesLinks] = useState([]);

  useEffect(() => {
    const getVideoData = async () => {
      const response = await axios
        .get(`/api/videoData?hash=${hash}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Video is Found");
            console.log(response.data);
            return response.data;
          }
          if (response.status === 400) {
            toast.success("No Video Found");
            return {};
          }
        })
        .catch((e) => {
          toast.error("Error in the server while getting video");
        });
      setVideoData(response);
      setEmotions(response.processingInfo?.emotions ?? []);
      setImagesLinks(response.processingInfo?.images ?? []);
    };
    hash && getVideoData();
  }, [hash, router]);

  useEffect(() => {
    const total = emotions.reduce((accumulator, object) => {
      return accumulator + object?.count;
    }, 0);
    console.log(total);
  }, [emotions]);

  const emotionsData = [
    { name: "Happy", count: 10 },
    { name: "Sad", count: 5 },
    { name: "Angry", count: 8 },

    // Add more emotions as needed
  ];
  const emotionChartOptions = {
    labels: emotions.map((emotion) => emotion.name),
    dataLabels: {
      enabled: false, // Disable data labels
    },
    legend: {
      show: true, // Hide legend
    },
    plotOptions: {
      pie: {
        customScale: 0.8, // Adjust size of the chart
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total", // Show 'Total' label
            },
          },
        },
      },
    },
  };

  const studentsChartOptions = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    series: [70],
    labels: ["Students"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "30px",
            formatter: function (val) {
              return parseInt(val);
            },
          },
        },
      },
    },
  };
  const averageHappinessOptions = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    labels: ["Students"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "30px",
          },
        },
      },
    },
  };
  const chartOptions = {
    emotions: {
      name: "Emotions",
      options: emotionChartOptions,
      type: "donut" as const,
      series: emotions.map((emotion) => emotion.count),
    },
    // studentCount: {
    //   name: "Student's Count",
    //   options: studentsChartOptions,
    //   type: "radialBar" as const,
    //   series: [75],
    // },
    // averageHappiness: {
    //   name: "Engagement",
    //   options: averageHappinessOptions,
    //   type: "radialBar" as const,
    //   series: [50],
    // },
  };
  const fetchVideoUrl = async () => {
    const response = await axios
      .get(`/api/videoData?hash=${hash}`)
      .then((response) => response.data);
  };
  return (
    <AnimatePresence>
      <div className="flex flex-col w-full space-y-4">
        <Card>
          <CardHeader>
            <CardTitle onClick={fetchVideoUrl}>Processed Video</CardTitle>
            <CardDescription>
              The result obtained and objects detected after processing the
              video
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex justify-center items-center">
            <video className="w-4/5 rounded-lg" loop controls autoPlay={true}>
              <source
                src={`/api/video-stream?hash=${hash}&edit=1`}
                type="video/mp4"
              />
            </video>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Processed Frames</CardTitle>
              <CardDescription>
                Thumbnails of processed frames from the video.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-0.5 p-0.5">
                {Object.entries(imagesLinks).map((e) => {
                  return <FilterShower key={e} image={e} />;
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Video Stats</CardTitle>
              <CardDescription>
                Statistics about the video content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-1 text-sm ">
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Total Duration</dt>
                  <dd className="ml-auto">
                    {(videoData?.metadata?.duration / 50 / 100)
                      .toFixed(2)
                      .toString()
                      .split(".")
                      .join(":")}
                  </dd>
                </div>
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Resolution</dt>
                  <dd className="ml-auto">
                    {`${videoData?.metadata?.dimentions?.width}x${videoData?.metadata?.dimentions?.height}`}
                  </dd>
                </div>
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Frame Rate</dt>
                  <dd className="ml-auto">30 fps</dd>
                </div>
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Codec</dt>
                  <dd className="ml-auto">{videoData?.metadata?.codec}</dd>
                </div>
              </dl>
              <div className="flex flex-col  min-h-lg w-full my-4">
                {Object.entries(chartOptions).map((e) => {
                  return (
                    <div key={e[0]} className="flex flex-col my-4">
                      <span className="font-medium text-gra text-xl">
                        {e[1].name}
                      </span>
                      <ReactApexChart
                        options={e[1].options}
                        series={e[1].series}
                        type={e[1].type}
                      />
                    </div>
                  );
                })}
                <div className="flex flex-col my-4">
                  <span className="font-medium  text-xl">Dominating Mood</span>
                  <span className="font-semibold text-center  text-3xl my-16 capitalize">
                    {emotions.sort()[0]?.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatePresence>
  );
}

function FilterShower({ image }: { image: [string, string] }) {
  const { scrollYProgress } = useScroll();

  const divRef = useRef(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [yPos, setYPos] = useState(0);
  const [xPos, setXPos] = useState(0);
  const [rectState, setRectState] = useState<any>();
  const [newSize, setNewSize] = useState(0);
  useEffect(() => {
    if (divRef.current) {
      const divRect = divRef.current.getBoundingClientRect();
      setRectState(divRect);

      const viewportWidth = window?.innerWidth;
      const viewportHeight = window?.innerHeight;

      // Calculate the new position to center the div
      const newX = (viewportWidth - divRect.width) / 2;
      const newY = (viewportHeight - divRect.height) / 2;

      setNewSize(window?.innerHeight * 0.75);
      const nSize = window?.innerHeight * 0.75;
      // Apply the new position
      setXPos(newX - divRect.left - nSize / 4);
      setYPos(newY - divRect.top - nSize / 4);
    }
    console.log(String(image[1]).substring(2));
  }, []);

  const variants = {
    initial: { left: 0, top: 0, zIndex: 1 },
    expanded: {
      left: xPos,
      top: yPos + scrollYProgress,
      zIndex: 99,
      width: newSize,
      height: newSize,
    },
  };
  return (
    <motion.div
      ref={divRef}
      variants={variants}
      animate={isImageExpanded ? "expanded" : "initial"}
      onClick={() => {
        console.log("happed");
        if (isImageExpanded) {
          const backdropToRemove = document.getElementById("backdrop");
          if (!!backdropToRemove) {
            backdropToRemove.parentNode?.removeChild(backdropToRemove);
          }
        } else {
          const backdrop = document.createElement("div");
          // Set backdrop styles
          backdrop.style.position = "fixed";
          backdrop.style.top = "0";
          backdrop.style.left = "0";
          backdrop.style.width = "100%";
          backdrop.style.height = "100%";
          backdrop.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; // Semi-transparent white for glassy effect
          backdrop.style.zIndex = "50";
          backdrop.style.backdropFilter = "blur(5px)"; // Add glassy effect
          // Set backdrop ID
          backdrop.id = "backdrop";
          // Append the backdrop to the body
          document.body.appendChild(backdrop);
        }
        setIsImageExpanded(!isImageExpanded);
      }}
      className={`relative group aspect-square cursor-pointer overflow-clip rounded-md`}
    >
      {isImageExpanded && (
        <div className="absolute w-full p-2  bg-gradient-to-b from-stone-900  via-stone-900/75 to-stone-900/0">
          <span className="font-semibold text-lg text-stone-50">
            {image[0]}
          </span>
        </div>
      )}
      <img
        alt="Frame 1"
        className="object-cover w-full h-full "
        height="150"
        src={
          "data:image/jpeg;base64," + String(image[1]).substring(2).slice(0, -1)
        }
        style={{
          aspectRatio: "150/150",
          objectFit: "cover",
        }}
        width="150"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 backdrop-brightness-90 group-hover:opacity-100 transition-opacity">
        <ArrowsPointingOutIcon className="w-10 h-10 text-white" />
      </div>
    </motion.div>
  );
}

function formatMilliseconds(milliseconds) {
  var totalSeconds = Math.floor(milliseconds / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var remainingSeconds = totalSeconds % 60;

  var formattedTime = "";
  if (hours > 0) {
    formattedTime += hours + "h ";
  }
  if (minutes > 0) {
    formattedTime += minutes + "m ";
  }
  if (remainingSeconds > 0) {
    formattedTime += remainingSeconds + "s";
  }

  return formattedTime.trim();
}
