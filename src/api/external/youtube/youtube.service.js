// src/services/youtubeService.js

import axios from 'axios';

const API_KEY = 'AIzaSyBFPH8VAVxLOTqHVNLe43huitDZ-Nut0II'; // Reemplaza con tu clave de API
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
const CATEGORIES_URL = 'https://www.googleapis.com/youtube/v3/videoCategories';

export const getVideoDetails = async (videoId) => {
  try {
    const response = await axios.get(VIDEOS_URL, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: API_KEY,
      },
    });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(CATEGORIES_URL, {
      params: {
        part: 'snippet',
        key: API_KEY,
        regionCode: 'US',
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const fetchVideoStatisticsAndDetails = async (videoId) => {
  try {
    const response = await axios.get(VIDEOS_URL, {
      params: {
        part: 'statistics, contentDetails',
        id: videoId,
        key: API_KEY,
      },
    });

    const details = response.data.items[0];
    const viewCount = parseInt(details.statistics.viewCount, 10);
    const duration = parseDuration(details.contentDetails.duration);

    return { viewCount, duration };
  } catch (error) {
    console.error('Error fetching video statistics:', error);
    return { viewCount: 0, duration: { hours: 0, minutes: 0, seconds: 0 } }; // Retorna 0 si hay un error
  }
};

const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return { hours, minutes, seconds };
};

export const searchVideos = async (query, musicCategoryId) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: musicCategoryId,
        key: API_KEY,
        maxResults: 10, // Ajusta el número de resultados según lo necesites
      },
    });

    const videoData = response.data.items;

    const videosWithDetails = await Promise.all(
      videoData.map(async (video) => {
        const details = await fetchVideoStatisticsAndDetails(video.id.videoId);
        return { ...video, ...details };
      })
    );

    const filteredVideos = videosWithDetails.filter(({ duration }) => {
      const { hours, minutes } = duration;
      return hours === 0 && minutes >= 2.2 && minutes <= 8;
    });

    filteredVideos.sort((a, b) => b.viewCount - a.viewCount);

    return filteredVideos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
