"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import type {
  Feature,
  FeatureCollection,
  Geometry,
} from "geojson";
import type { Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";
import { supabase } from "../lib/supabase";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[440px] items-center justify-center text-sm text-pink-200 sm:h-[560px]">
      Preparing the globe...
    </div>
  ),
});

type GlobeProps = ComponentProps<typeof Globe>;


type MapHeartRow = {
  id: number;
  latitude: number | string;
  longitude: number | string;
  country: string | null;
  region: string | null;
  created_at: string;
};

type DisplayHeart = {
  id: string;
  lat: number;
  lng: number;
  country: string;
  region: string | null;
  selected: boolean;
};

type CountryProperties = {
  name?: string;
};

type RegionOption = {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
};

type SelectedLocation = {
  latitude: number;
  longitude: number;
  country: string;
  countryCode: "US" | "CA" | null;
  region: string;
};

const HEART_STORAGE_KEY =
  "messages-to-dom-map-heart-submitted";

const COUNTRY_COLORS = [
  "rgba(236, 72, 153, 0.82)",
  "rgba(168, 85, 247, 0.82)",
  "rgba(99, 102, 241, 0.82)",
  "rgba(59, 130, 246, 0.82)",
  "rgba(20, 184, 166, 0.82)",
  "rgba(249, 115, 22, 0.82)",
];

const unitedStatesRegions: RegionOption[] = [
  {
    code: "AL",
    name: "Alabama",
    latitude: 32.8,
    longitude: -86.8,
  },
  {
    code: "AK",
    name: "Alaska",
    latitude: 64.2,
    longitude: -152.5,
  },
  {
    code: "AZ",
    name: "Arizona",
    latitude: 34.3,
    longitude: -111.7,
  },
  {
    code: "AR",
    name: "Arkansas",
    latitude: 35.2,
    longitude: -92.4,
  },
  {
    code: "CA",
    name: "California",
    latitude: 37.2,
    longitude: -119.7,
  },
  {
    code: "CO",
    name: "Colorado",
    latitude: 39,
    longitude: -105.5,
  },
  {
    code: "CT",
    name: "Connecticut",
    latitude: 41.6,
    longitude: -72.7,
  },
  {
    code: "DE",
    name: "Delaware",
    latitude: 39,
    longitude: -75.5,
  },
  {
    code: "DC",
    name: "Washington, D.C.",
    latitude: 38.9,
    longitude: -77,
  },
  {
    code: "FL",
    name: "Florida",
    latitude: 28.6,
    longitude: -82.4,
  },
  {
    code: "GA",
    name: "Georgia",
    latitude: 32.7,
    longitude: -83.3,
  },
  {
    code: "HI",
    name: "Hawaii",
    latitude: 20.8,
    longitude: -157.5,
  },
  {
    code: "ID",
    name: "Idaho",
    latitude: 44.2,
    longitude: -114.5,
  },
  {
    code: "IL",
    name: "Illinois",
    latitude: 40,
    longitude: -89.2,
  },
  {
    code: "IN",
    name: "Indiana",
    latitude: 39.9,
    longitude: -86.3,
  },
  {
    code: "IA",
    name: "Iowa",
    latitude: 42,
    longitude: -93.5,
  },
  {
    code: "KS",
    name: "Kansas",
    latitude: 38.5,
    longitude: -98.4,
  },
  {
    code: "KY",
    name: "Kentucky",
    latitude: 37.5,
    longitude: -85.3,
  },
  {
    code: "LA",
    name: "Louisiana",
    latitude: 31,
    longitude: -92,
  },
  {
    code: "ME",
    name: "Maine",
    latitude: 45.3,
    longitude: -69,
  },
  {
    code: "MD",
    name: "Maryland",
    latitude: 39,
    longitude: -76.7,
  },
  {
    code: "MA",
    name: "Massachusetts",
    latitude: 42.3,
    longitude: -71.8,
  },
  {
    code: "MI",
    name: "Michigan",
    latitude: 44.3,
    longitude: -85.6,
  },
  {
    code: "MN",
    name: "Minnesota",
    latitude: 46.3,
    longitude: -94.2,
  },
  {
    code: "MS",
    name: "Mississippi",
    latitude: 32.7,
    longitude: -89.7,
  },
  {
    code: "MO",
    name: "Missouri",
    latitude: 38.5,
    longitude: -92.5,
  },
  {
    code: "MT",
    name: "Montana",
    latitude: 47,
    longitude: -109.6,
  },
  {
    code: "NE",
    name: "Nebraska",
    latitude: 41.5,
    longitude: -99.8,
  },
  {
    code: "NV",
    name: "Nevada",
    latitude: 39.4,
    longitude: -116.6,
  },
  {
    code: "NH",
    name: "New Hampshire",
    latitude: 43.7,
    longitude: -71.6,
  },
  {
    code: "NJ",
    name: "New Jersey",
    latitude: 40.1,
    longitude: -74.5,
  },
  {
    code: "NM",
    name: "New Mexico",
    latitude: 34.4,
    longitude: -106.1,
  },
  {
    code: "NY",
    name: "New York",
    latitude: 42.9,
    longitude: -75.5,
  },
  {
    code: "NC",
    name: "North Carolina",
    latitude: 35.5,
    longitude: -79.4,
  },
  {
    code: "ND",
    name: "North Dakota",
    latitude: 47.5,
    longitude: -100.5,
  },
  {
    code: "OH",
    name: "Ohio",
    latitude: 40.4,
    longitude: -82.8,
  },
  {
    code: "OK",
    name: "Oklahoma",
    latitude: 35.6,
    longitude: -97.5,
  },
  {
    code: "OR",
    name: "Oregon",
    latitude: 44,
    longitude: -120.6,
  },
  {
    code: "PA",
    name: "Pennsylvania",
    latitude: 40.9,
    longitude: -77.8,
  },
  {
    code: "RI",
    name: "Rhode Island",
    latitude: 41.7,
    longitude: -71.6,
  },
  {
    code: "SC",
    name: "South Carolina",
    latitude: 33.8,
    longitude: -80.9,
  },
  {
    code: "SD",
    name: "South Dakota",
    latitude: 44.4,
    longitude: -100.2,
  },
  {
    code: "TN",
    name: "Tennessee",
    latitude: 35.8,
    longitude: -86.4,
  },
  {
    code: "TX",
    name: "Texas",
    latitude: 31.5,
    longitude: -99.3,
  },
  {
    code: "UT",
    name: "Utah",
    latitude: 39.3,
    longitude: -111.7,
  },
  {
    code: "VT",
    name: "Vermont",
    latitude: 44,
    longitude: -72.7,
  },
  {
    code: "VA",
    name: "Virginia",
    latitude: 37.5,
    longitude: -78.8,
  },
  {
    code: "WA",
    name: "Washington",
    latitude: 47.4,
    longitude: -120.7,
  },
  {
    code: "WV",
    name: "West Virginia",
    latitude: 38.6,
    longitude: -80.6,
  },
  {
    code: "WI",
    name: "Wisconsin",
    latitude: 44.6,
    longitude: -89.6,
  },
  {
    code: "WY",
    name: "Wyoming",
    latitude: 43,
    longitude: -107.6,
  },
];

const canadianRegions: RegionOption[] = [
  {
    code: "AB",
    name: "Alberta",
    latitude: 54,
    longitude: -115,
  },
  {
    code: "BC",
    name: "British Columbia",
    latitude: 53.7,
    longitude: -124,
  },
  {
    code: "MB",
    name: "Manitoba",
    latitude: 54.8,
    longitude: -97.4,
  },
  {
    code: "NB",
    name: "New Brunswick",
    latitude: 46.6,
    longitude: -66.5,
  },
  {
    code: "NL",
    name: "Newfoundland and Labrador",
    latitude: 53.1,
    longitude: -57.7,
  },
  {
    code: "NS",
    name: "Nova Scotia",
    latitude: 45.2,
    longitude: -63,
  },
  {
    code: "NT",
    name: "Northwest Territories",
    latitude: 64.8,
    longitude: -124.8,
  },
  {
    code: "NU",
    name: "Nunavut",
    latitude: 70.3,
    longitude: -86.8,
  },
  {
    code: "ON",
    name: "Ontario",
    latitude: 50,
    longitude: -85,
  },
  {
    code: "PE",
    name: "Prince Edward Island",
    latitude: 46.4,
    longitude: -63.4,
  },
  {
    code: "QC",
    name: "Quebec",
    latitude: 52,
    longitude: -71.8,
  },
  {
    code: "SK",
    name: "Saskatchewan",
    latitude: 54.5,
    longitude: -106,
  },
  {
    code: "YT",
    name: "Yukon",
    latitude: 64,
    longitude: -135,
  },
];

function normalizeLongitude(longitude: number) {
  return ((longitude + 180) % 360 + 360) % 360 - 180;
}

function clampLatitude(latitude: number) {
  return Math.max(-89, Math.min(89, latitude));
}

function approximateCoordinate(value: number) {
  return Math.round(value);
}

function getCountryCode(
  country: Feature<Geometry, CountryProperties>,
): "US" | "CA" | null {
  const countryId = String(country.id ?? "");
  const countryName =
    country.properties?.name?.toLowerCase() ?? "";

  if (
    countryId === "840" ||
    countryName.includes("united states")
  ) {
    return "US";
  }

  if (
    countryId === "124" ||
    countryName === "canada"
  ) {
    return "CA";
  }

  return null;
}

function getCountryName(
  country: Feature<Geometry, CountryProperties>,
) {
  const countryCode = getCountryCode(country);

  if (countryCode === "US") {
    return "United States of America";
  }

  if (countryCode === "CA") {
    return "Canada";
  }

  return country.properties?.name || "Selected country";
}

function createHeartElement(data: object): HTMLElement {
  const heart = data as DisplayHeart;
  const wrapper = document.createElement("div");

  wrapper.setAttribute("aria-hidden", "true");
  wrapper.title = heart.region
    ? `${heart.region}, ${heart.country}`
    : heart.country;

  wrapper.textContent = "♥";
  wrapper.style.display = "grid";
  wrapper.style.placeItems = "center";
  wrapper.style.width = heart.selected ? "38px" : "31px";
  wrapper.style.height = heart.selected ? "38px" : "31px";
  wrapper.style.color = "#050505";
  wrapper.style.fontFamily = "Arial, sans-serif";
  wrapper.style.fontSize = heart.selected ? "36px" : "30px";
  wrapper.style.fontWeight = "900";
  wrapper.style.lineHeight = "1";
  wrapper.style.textShadow = [
    "-1.5px -1.5px 0 #f9a8d4",
    "1.5px -1.5px 0 #f9a8d4",
    "-1.5px 1.5px 0 #f9a8d4",
    "1.5px 1.5px 0 #f9a8d4",
    "0 0 9px rgba(244, 114, 182, 0.95)",
    "0 0 18px rgba(236, 72, 153, 0.75)",
  ].join(", ");
  wrapper.style.pointerEvents = "none";
  wrapper.style.userSelect = "none";
  wrapper.style.transform = "translate(-50%, -50%)";
  wrapper.style.filter =
    "drop-shadow(0 3px 3px rgba(0, 0, 0, 0.85))";

  if (heart.selected) {
    wrapper.style.animation =
      "world-heart-pulse 1.2s ease-in-out infinite";
  }

  return wrapper;
}

export default function WorldHeartMap() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dimensions, setDimensions] = useState({
    width: 900,
    height: 560,
  });

  const [hearts, setHearts] = useState<MapHeartRow[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  const countries = useMemo(() => {
    const topology = worldData as unknown as Topology;

    return feature(
      topology,
      topology.objects.countries,
    ) as unknown as FeatureCollection<
      Geometry,
      CountryProperties
    >;
  }, []);

  const approvedHearts = useMemo<DisplayHeart[]>(() => {
    return hearts
      .map((heart) => ({
        id: `approved-${heart.id}`,
        lat: Number(heart.latitude),
        lng: Number(heart.longitude),
        country: heart.country || "Unknown country",
        region: heart.region,
        selected: false,
      }))
      .filter(
        (heart) =>
          Number.isFinite(heart.lat) &&
          Number.isFinite(heart.lng),
      );
  }, [hearts]);

  const markerData = useMemo<DisplayHeart[]>(() => {
    if (!selectedLocation || hasSubmitted) {
      return approvedHearts;
    }

    return [
      ...approvedHearts,
      {
        id: "selected-location",
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
        country: selectedLocation.country,
        region: selectedLocation.region || null,
        selected: true,
      },
    ];
  }, [approvedHearts, hasSubmitted, selectedLocation]);

  const countryCount = useMemo(() => {
    return new Set(
      approvedHearts
        .map((heart) => heart.country)
        .filter(Boolean),
    ).size;
  }, [approvedHearts]);

  const availableRegions =
    selectedLocation?.countryCode === "US"
      ? unitedStatesRegions
      : selectedLocation?.countryCode === "CA"
        ? canadianRegions
        : [];

  const requiresRegion =
    selectedLocation?.countryCode === "US" ||
    selectedLocation?.countryCode === "CA";

  useEffect(() => {
    const submitted =
      window.localStorage.getItem(HEART_STORAGE_KEY) ===
      "true";

    setHasSubmitted(submitted);

    async function loadApprovedHearts() {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("map_hearts")
        .select(
          "id, latitude, longitude, country, region, created_at",
        )
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Could not load map hearts:", error);
        setLoadError(
          "The community hearts could not be loaded.",
        );
        setIsLoading(false);
        return;
      }

      setHearts((data ?? []) as MapHeartRow[]);
      setIsLoading(false);
    }

    void loadApprovedHearts();
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateSize = () => {
      const width = Math.max(
        320,
        Math.floor(container.clientWidth),
      );

      setDimensions({
        width,
        height: width < 640 ? 440 : 560,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const globe = globeRef.current;

    if (!globe) {
      return;
    }

    const controls = globe.controls();
    controls.autoRotate =
      !selectedLocation && !isSubmitting;
  }, [isSubmitting, selectedLocation]);

  function handleGlobeReady() {
    const globe = globeRef.current;

    if (!globe) {
      return;
    }

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enablePan = false;
    controls.minDistance = 175;
    controls.maxDistance = 420;

    globe.pointOfView(
      {
        lat: 24,
        lng: -25,
        altitude: 2.15,
      },
      0,
    );
  }

  function handleGlobeClick({
    lat,
    lng,
  }: {
    lat: number;
    lng: number;
  }) {
    if (hasSubmitted || isSubmitting) {
      return;
    }

    const latitude = clampLatitude(Number(lat));
    const longitude = normalizeLongitude(Number(lng));

    const country = countries.features.find((item) =>
      geoContains(item, [longitude, latitude]),
    );

    if (!country) {
      setMessage(
        "That point is in the ocean. Please click on land near where you live.",
      );
      return;
    }

    const countryCode = getCountryCode(country);

    setSelectedLocation({
      latitude,
      longitude,
      country: getCountryName(country),
      countryCode,
      region: "",
    });

    setMessage("");

    globeRef.current?.pointOfView(
      {
        lat: latitude,
        lng: longitude,
        altitude: 1.8,
      },
      700,
    );
  }

  function handleRegionChange(regionCode: string) {
    if (!selectedLocation) {
      return;
    }

    const region = availableRegions.find(
      (item) => item.code === regionCode,
    );

    if (!region) {
      setSelectedLocation({
        ...selectedLocation,
        region: "",
      });
      return;
    }

    setSelectedLocation({
      ...selectedLocation,
      latitude: region.latitude,
      longitude: region.longitude,
      region: region.name,
    });

    setMessage("");

    globeRef.current?.pointOfView(
      {
        lat: region.latitude,
        lng: region.longitude,
        altitude: 1.65,
      },
      700,
    );
  }

  function cancelSelection() {
    if (isSubmitting) {
      return;
    }

    setSelectedLocation(null);
    setMessage("");
  }

  async function submitHeart() {
    if (
      !selectedLocation ||
      isSubmitting ||
      hasSubmitted
    ) {
      return;
    }

    if (requiresRegion && !selectedLocation.region) {
      setMessage(
        selectedLocation.countryCode === "US"
          ? "Please choose your state before adding your heart."
          : "Please choose your province or territory before adding your heart.",
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase
      .from("map_hearts")
      .insert({
        latitude: approximateCoordinate(
          selectedLocation.latitude,
        ),
        longitude: approximateCoordinate(
          selectedLocation.longitude,
        ),
        country: selectedLocation.country,
        region: selectedLocation.region || null,
        status: "pending",
      });

    if (error) {
      console.error("Could not submit map heart:", error);
      setMessage(
        "Your heart could not be submitted. Please try again.",
      );
      setIsSubmitting(false);
      return;
    }

    window.localStorage.setItem(
      HEART_STORAGE_KEY,
      "true",
    );

    setHasSubmitted(true);
    setSelectedLocation(null);
    setMessage(
      "Your anonymous heart was submitted and will appear after approval. 🖤",
    );
    setIsSubmitting(false);
  }

  const polygonCapColor: NonNullable<
    GlobeProps["polygonCapColor"]
  > = (countryObject) => {
    const country =
      countryObject as Feature<
        Geometry,
        CountryProperties
      >;

    const id = String(country.id ?? "0");
    const numericId =
      Number.parseInt(id.replace(/\D/g, ""), 10) || 0;

    return COUNTRY_COLORS[
      numericId % COUNTRY_COLORS.length
    ];
  };

  return (
    <section className="border-y border-pink-500/20 bg-white/[0.02]">
      <style jsx global>{`
        @keyframes world-heart-pulse {
          0%,
          100% {
            scale: 1;
          }

          50% {
            scale: 1.22;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
            One heart, every corner
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Around the World
          </h2>

          <div className="mx-auto mt-4 h-px w-32 bg-pink-500/70" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-300">
            Where has Dom&apos;s music reached? Add one
            anonymous black heart near your part of the world.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Drag the globe with your mouse or finger. Tap land
            to choose your approximate location.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-2xl grid-cols-2 gap-3">
          <div className="border border-pink-400/25 bg-black/40 px-4 py-4 text-center">
            <p className="font-serif text-3xl text-pink-200">
              {approvedHearts.length}
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">
              Community Hearts
            </p>
          </div>

          <div className="border border-pink-400/25 bg-black/40 px-4 py-4 text-center">
            <p className="font-serif text-3xl text-pink-200">
              {countryCount}
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">
              Countries Reached
            </p>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto mt-8 max-w-5xl overflow-hidden border border-pink-400/30 bg-gradient-to-b from-[#090f2d] via-[#160d2b] to-black shadow-[0_0_40px_rgba(236,72,153,0.16)]"
        >
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            showGlobe
            showGraticules
            showAtmosphere
            atmosphereColor="#ec4899"
            atmosphereAltitude={0.16}
            animateIn
            polygonsData={countries.features}
            polygonAltitude={0.008}
            polygonCapColor={polygonCapColor}
            polygonSideColor={() =>
              "rgba(236, 72, 153, 0.12)"
            }
            polygonStrokeColor={() =>
              "rgba(253, 242, 248, 0.70)"
            }
            polygonsTransitionDuration={0}
            htmlElementsData={markerData}
            htmlLat="lat"
            htmlLng="lng"
            htmlAltitude={0.035}
            htmlElement={createHeartElement}
            htmlTransitionDuration={250}
            onGlobeClick={handleGlobeClick}
            onGlobeReady={handleGlobeReady}
          />

          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap border border-white/15 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-gray-300 backdrop-blur-sm">
            Drag to spin · Tap land to add a heart
          </div>
        </div>

        <div className="mt-6 text-center">
          {isLoading && (
            <p className="text-sm text-pink-200">
              Gathering hearts from around the world...
            </p>
          )}

          {loadError && (
            <p className="text-sm text-red-300">
              {loadError}
            </p>
          )}

          {!isLoading &&
            !loadError &&
            approvedHearts.length === 0 && (
              <p className="text-sm text-gray-500">
                The first approved community hearts will
                appear here.
              </p>
            )}

          {!hasSubmitted && !selectedLocation && (
            <p className="mt-4 text-sm text-gray-400">
              Spin the globe, then tap your country.
            </p>
          )}

          {selectedLocation && !hasSubmitted && (
            <div className="mx-auto mt-7 max-w-xl border border-pink-400/35 bg-gradient-to-b from-pink-950/35 to-black p-6 text-left shadow-[0_0_28px_rgba(236,72,153,0.14)]">
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
                Your approximate location
              </p>

              <h3 className="mt-3 font-serif text-2xl text-pink-100">
                📍 {selectedLocation.country}
              </h3>

              {requiresRegion && (
                <div className="mt-6">
                  <label
                    htmlFor="heart-region"
                    className="block text-sm font-semibold text-pink-200"
                  >
                    {selectedLocation.countryCode === "US"
                      ? "Choose your state"
                      : "Choose your province or territory"}
                  </label>

                  <select
                    id="heart-region"
                    value={
                      availableRegions.find(
                        (region) =>
                          region.name ===
                          selectedLocation.region,
                      )?.code ?? ""
                    }
                    onChange={(event) =>
                      handleRegionChange(event.target.value)
                    }
                    disabled={isSubmitting}
                    className="mt-3 w-full border border-pink-400/40 bg-black px-4 py-3 text-base text-white outline-none transition focus:border-pink-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {selectedLocation.countryCode === "US"
                        ? "Select a state"
                        : "Select a province or territory"}
                    </option>

                    {availableRegions.map((region) => (
                      <option
                        key={region.code}
                        value={region.code}
                      >
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedLocation.region && (
                <p className="mt-4 font-serif text-xl text-white">
                  🖤 {selectedLocation.region}
                </p>
              )}

              <div className="mt-5 border-l-2 border-pink-400/50 pl-4">
                <p className="text-sm leading-6 text-gray-300">
                  Your exact location is not stored.
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {requiresRegion
                    ? "Your heart will be placed near the center of the state, province, or territory you choose."
                    : "The selected map point is rounded before it is submitted."}{" "}
                  No name, email, account, street address, or
                  GPS permission is requested.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={cancelSelection}
                  disabled={isSubmitting}
                  className="border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.16em] text-gray-300 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Choose Again
                </button>

                <button
                  type="button"
                  onClick={submitHeart}
                  disabled={
                    isSubmitting ||
                    (requiresRegion &&
                      !selectedLocation.region)
                  }
                  className="border border-pink-400 bg-pink-950/60 px-5 py-3 text-sm uppercase tracking-[0.16em] text-pink-100 transition hover:bg-pink-900/70 hover:shadow-[0_0_22px_rgba(236,72,153,0.38)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Adding Heart..."
                    : "Add My Heart 🖤"}
                </button>
              </div>
            </div>
          )}

          {hasSubmitted && (
            <p className="mt-5 font-serif text-lg text-pink-200">
              Thank you for adding your heart to the
              community. 🖤
            </p>
          )}

          {message && (
            <p
              aria-live="polite"
              className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-300"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}