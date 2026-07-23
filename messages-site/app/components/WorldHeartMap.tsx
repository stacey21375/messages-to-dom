"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  geoContains,
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { feature } from "topojson-client";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import type { Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";
import usData from "us-atlas/states-10m.json";
import { supabase } from "../lib/supabase";

type MapHeartRecord = {
  id: number;
  latitude: number;
  longitude: number;
  country: string | null;
  region: string | null;
  created_at: string;
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

type GlobeRotation = [number, number, number];

type DragState = {
  startClientX: number;
  startClientY: number;
  startRotation: GlobeRotation;
  hasDragged: boolean;
};

const MAP_WIDTH = 900;
const MAP_HEIGHT = 600;
const GLOBE_CENTER_X = MAP_WIDTH / 2;
const GLOBE_CENTER_Y = MAP_HEIGHT / 2;
const GLOBE_SCALE = 265;

const HEART_STORAGE_KEY =
  "messages-to-dom-map-heart-submitted";

const countryColors = [
  "#ec4899",
  "#a855f7",
  "#6366f1",
  "#3b82f6",
  "#14b8a6",
  "#f97316",
];

const globeSphere = {
  type: "Sphere",
} as const;

const graticule = geoGraticule10();

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
  const countryName = country.properties?.name?.toLowerCase() ?? "";

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

function getDisplayCountryName(
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

export default function WorldHeartMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const [rotation, setRotation] = useState<GlobeRotation>([
    -10,
    -18,
    0,
  ]);

  const [hearts, setHearts] = useState<MapHeartRecord[]>([]);

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  const states = useMemo(() => {
    const topology = usData as unknown as Topology;

    return feature(
      topology,
      topology.objects.states,
    ) as unknown as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
  }, []);

  const projection = useMemo(() => {
    return geoOrthographic()
      .translate([GLOBE_CENTER_X, GLOBE_CENTER_Y])
      .scale(GLOBE_SCALE)
      .rotate(rotation)
      .clipAngle(90)
      .precision(0.4);
  }, [rotation]);

  const pathGenerator = useMemo(() => {
    return geoPath(projection);
  }, [projection]);

  const countryCount = useMemo(() => {
    const reachedCountries = new Set<string>();

    hearts.forEach((heart) => {
      if (heart.country) {
        reachedCountries.add(heart.country);
        return;
      }

      const coordinates: [number, number] = [
        heart.longitude,
        heart.latitude,
      ];

      const matchingCountry = countries.features.find((country) =>
        geoContains(country, coordinates),
      );

      const countryName =
        matchingCountry?.properties?.name;

      if (countryName) {
        reachedCountries.add(countryName);
      }
    });

    return reachedCountries.size;
  }, [countries, hearts]);

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
    const previouslySubmitted =
      window.localStorage.getItem(HEART_STORAGE_KEY) === "true";

    setHasSubmitted(previouslySubmitted);

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
        console.log("Could not load map hearts:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        setLoadError(
          "The community hearts could not be loaded.",
        );

        setIsLoading(false);
        return;
      }

      setHearts((data ?? []) as MapHeartRecord[]);
      setIsLoading(false);
    }

    loadApprovedHearts();
  }, []);

  useEffect(() => {
    if (selectedLocation || isDragging || isSubmitting) {
      return;
    }

    const rotationTimer = window.setInterval(() => {
      setRotation((currentRotation) => [
        currentRotation[0] + 0.14,
        currentRotation[1],
        currentRotation[2],
      ]);
    }, 40);

    return () => {
      window.clearInterval(rotationTimer);
    };
  }, [isDragging, isSubmitting, selectedLocation]);

  function findCountry(
    coordinates: [number, number],
  ): Feature<Geometry, CountryProperties> | undefined {
    return countries.features.find((country) =>
      geoContains(country, coordinates),
    );
  }

  function selectLocationFromPointer(
    event: ReactPointerEvent<SVGSVGElement>,
  ) {
    if (hasSubmitted || isSubmitting) {
      return;
    }

    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const bounds = svg.getBoundingClientRect();

    const svgX =
      ((event.clientX - bounds.left) / bounds.width) *
      MAP_WIDTH;

    const svgY =
      ((event.clientY - bounds.top) / bounds.height) *
      MAP_HEIGHT;

    const distanceFromCenter = Math.sqrt(
      Math.pow(svgX - GLOBE_CENTER_X, 2) +
        Math.pow(svgY - GLOBE_CENTER_Y, 2),
    );

    if (distanceFromCenter > GLOBE_SCALE) {
      setMessage(
        "Click directly on the globe to choose your location.",
      );
      return;
    }

    const coordinates = projection.invert?.([svgX, svgY]);

    if (!coordinates) {
      setMessage(
        "That location could not be selected. Please try again.",
      );
      return;
    }

    const longitude = normalizeLongitude(coordinates[0]);
    const latitude = clampLatitude(coordinates[1]);

    const matchingCountry = findCountry([
      longitude,
      latitude,
    ]);

    if (!matchingCountry) {
      setMessage(
        "That point is in the ocean. Please click on land near where you live.",
      );
      return;
    }

    const countryCode = getCountryCode(matchingCountry);
    const countryName =
      getDisplayCountryName(matchingCountry);

    setSelectedLocation({
      latitude,
      longitude,
      country: countryName,
      countryCode,
      region: "",
    });

    setMessage("");
  }

  function handlePointerDown(
    event: ReactPointerEvent<SVGSVGElement>,
  ) {
    if (isSubmitting) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    dragStateRef.current = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      startRotation: rotation,
      hasDragged: false,
    };

    setIsDragging(true);
  }

  function handlePointerMove(
    event: ReactPointerEvent<SVGSVGElement>,
  ) {
    const dragState = dragStateRef.current;

    if (!dragState) {
      return;
    }

    const horizontalMovement =
      event.clientX - dragState.startClientX;

    const verticalMovement =
      event.clientY - dragState.startClientY;

    const movementDistance = Math.sqrt(
      horizontalMovement * horizontalMovement +
        verticalMovement * verticalMovement,
    );

    if (movementDistance > 4) {
      dragState.hasDragged = true;
    }

    if (!dragState.hasDragged) {
      return;
    }

    const nextLongitude =
      dragState.startRotation[0] +
      horizontalMovement * 0.28;

    const nextLatitude = Math.max(
      -75,
      Math.min(
        75,
        dragState.startRotation[1] -
          verticalMovement * 0.28,
      ),
    );

    setRotation([
      nextLongitude,
      nextLatitude,
      0,
    ]);
  }

  function handlePointerUp(
    event: ReactPointerEvent<SVGSVGElement>,
  ) {
    const dragState = dragStateRef.current;

    if (!dragState) {
      setIsDragging(false);
      return;
    }

    if (
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    if (!dragState.hasDragged && !hasSubmitted) {
      selectLocationFromPointer(event);
    }

    dragStateRef.current = null;
    setIsDragging(false);
  }

  function handlePointerCancel(
    event: ReactPointerEvent<SVGSVGElement>,
  ) {
    if (
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    dragStateRef.current = null;
    setIsDragging(false);
  }

  function handleRegionChange(regionCode: string) {
    if (!selectedLocation) {
      return;
    }

    const selectedRegion = availableRegions.find(
      (region) => region.code === regionCode,
    );

    if (!selectedRegion) {
      setSelectedLocation({
        ...selectedLocation,
        region: "",
      });

      return;
    }

    setSelectedLocation({
      ...selectedLocation,
      latitude: selectedRegion.latitude,
      longitude: selectedRegion.longitude,
      region: selectedRegion.name,
    });

    setMessage("");
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

    const approximateLatitude = approximateCoordinate(
      selectedLocation.latitude,
    );

    const approximateLongitude = approximateCoordinate(
      selectedLocation.longitude,
    );

    const { error } = await supabase
      .from("map_hearts")
      .insert({
        latitude: approximateLatitude,
        longitude: approximateLongitude,
        country: selectedLocation.country,
        region: selectedLocation.region || null,
        status: "pending",
      });

    if (error) {
      console.log("Could not submit map heart:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

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

  const selectedPoint = selectedLocation
    ? projection([
        selectedLocation.longitude,
        selectedLocation.latitude,
      ])
    : null;

  return (
    <section className="border-y border-pink-500/20 bg-white/[0.02]">
      <style jsx>{`
        @keyframes heart-arrive {
          0% {
            opacity: 0;
            transform: scale(0);
          }

          70% {
            opacity: 1;
            transform: scale(1.3);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes selected-heart-pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.18);
          }
        }

        .approved-heart {
          opacity: 0;
          animation: heart-arrive 0.7s ease-out forwards;
          transform-box: fill-box;
          transform-origin: center;
        }

        .selected-heart {
          animation: selected-heart-pulse 1.3s ease-in-out
            infinite;
          transform-box: fill-box;
          transform-origin: center;
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
            Drag the globe with your mouse or finger. Tap a
            country to choose your approximate location.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-2xl grid-cols-2 gap-3">
          <div className="border border-pink-400/25 bg-black/40 px-4 py-4 text-center">
            <p className="font-serif text-3xl text-pink-200">
              {hearts.length}
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

        <div className="relative mx-auto mt-8 max-w-5xl overflow-hidden border border-pink-400/30 bg-gradient-to-b from-[#090f2d] via-[#160d2b] to-black shadow-[0_0_40px_rgba(236,72,153,0.16)]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />

          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label="A draggable rotating globe showing anonymous black hearts from the community"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={`relative h-auto w-full touch-none select-none ${
              isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
            }`}
          >
            <defs>
              <radialGradient
                id="globeOcean"
                cx="35%"
                cy="28%"
                r="75%"
              >
                <stop
                  offset="0%"
                  stopColor="#334155"
                />

                <stop
                  offset="42%"
                  stopColor="#172554"
                />

                <stop
                  offset="78%"
                  stopColor="#1e1b4b"
                />

                <stop
                  offset="100%"
                  stopColor="#050816"
                />
              </radialGradient>

              <radialGradient
                id="globeShine"
                cx="32%"
                cy="25%"
                r="55%"
              >
                <stop
                  offset="0%"
                  stopColor="#ffffff"
                  stopOpacity="0.22"
                />

                <stop
                  offset="100%"
                  stopColor="#ffffff"
                  stopOpacity="0"
                />
              </radialGradient>

              <filter
                id="globeGlow"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feGaussianBlur
                  stdDeviation="12"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter
                id="heartGlow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur
                  stdDeviation="2.5"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={pathGenerator(globeSphere) ?? ""}
              fill="url(#globeOcean)"
              stroke="#f472b6"
              strokeOpacity="0.8"
              strokeWidth="2"
              filter="url(#globeGlow)"
            />

            <path
              d={pathGenerator(graticule) ?? ""}
              fill="none"
              stroke="#f9a8d4"
              strokeOpacity="0.13"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />

            <g>
              {countries.features.map((country, index) => (
                <path
                  key={country.id ?? index}
                  d={pathGenerator(country) ?? ""}
                  fill={
                    countryColors[
                      index % countryColors.length
                    ]
                  }
                  fillOpacity="0.82"
                  stroke="#fdf2f8"
                  strokeOpacity="0.72"
                  strokeWidth="0.65"
                  vectorEffect="non-scaling-stroke"
                >
                  <title>
                    {country.properties?.name || "Country"}
                  </title>
                </path>
              ))}
            </g>

            <path
              d={pathGenerator(states) ?? ""}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.65"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />

            <path
              d={pathGenerator(globeSphere) ?? ""}
              fill="url(#globeShine)"
              pointerEvents="none"
            />

            <g pointerEvents="none">
              {hearts.map((heart, index) => {
                const point = projection([
                  heart.longitude,
                  heart.latitude,
                ]);

                if (!point) {
                  return null;
                }

                const globeCenter: [number, number] = [
                  -rotation[0],
                  -rotation[1],
                ];

                const isOnFront =
                  geoDistance(
                    [heart.longitude, heart.latitude],
                    globeCenter,
                  ) <
                  Math.PI / 2;

                if (!isOnFront) {
                  return null;
                }

                return (
                  <g
                    key={heart.id}
                    transform={`translate(${point[0]} ${point[1]})`}
                    className="approved-heart"
                    style={{
                      animationDelay: `${Math.min(
                        index * 55,
                        1400,
                      )}ms`,
                    }}
                  >
                    <path
                      d="M0 8 C-2 5 -10 0 -10 -6 C-10 -12 -3 -14 0 -8 C3 -14 10 -12 10 -6 C10 0 2 5 0 8 Z"
                      fill="#030303"
                      stroke="#f472b6"
                      strokeWidth="1.4"
                      filter="url(#heartGlow)"
                    />
                  </g>
                );
              })}

              {selectedPoint && !hasSubmitted && (
                <g
                  transform={`translate(${selectedPoint[0]} ${selectedPoint[1]}) scale(1.35)`}
                  className="selected-heart"
                >
                  <path
                    d="M0 8 C-2 5 -10 0 -10 -6 C-10 -12 -3 -14 0 -8 C3 -14 10 -12 10 -6 C10 0 2 5 0 8 Z"
                    fill="#030303"
                    stroke="#f9a8d4"
                    strokeWidth="1.8"
                    filter="url(#heartGlow)"
                  />
                </g>
              )}
            </g>
          </svg>

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
            hearts.length === 0 && (
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