import { RequestHandler } from "express";
import { 
  getUserList, 
  addToUserList, 
  removeFromUserList,
  getUserWatchProgress,
  updateWatchProgress
} from "../lib/database";

// Get user's watch progress
export const handleGetWatchProgress: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);

    if (!userIdNum) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz kullanıcı ID"
      });
    }

    const progress = await getUserWatchProgress(userIdNum);
    
    const transformedProgress = progress.map(p => ({
      animeId: p.anime_id.toString(),
      episodeId: p.episode_id,
      progress: p.progress,
      completed: p.completed,
      lastWatched: p.last_watched,
      anime: {
        title: p.title,
        poster: p.poster
      },
      episode: {
        title: p.episode_title,
        number: p.episode_number
      }
    }));

    res.json({
      success: true,
      data: transformedProgress
    });
  } catch (error) {
    console.error('Get watch progress error:', error);
    res.status(500).json({
      success: false,
      message: "İzleme geçmişi alınamadı"
    });
  }
};

// Update watch progress
export const handleUpdateWatchProgress: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { animeId, episodeId, progress } = req.body;
    
    const userIdNum = parseInt(userId);
    const animeIdNum = parseInt(animeId);
    const episodeIdNum = parseInt(episodeId);

    if (!userIdNum || !animeIdNum || !episodeIdNum || progress === undefined) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz parametreler"
      });
    }

    await updateWatchProgress(userIdNum, animeIdNum, episodeIdNum, progress);

    res.json({
      success: true,
      message: "İzleme ilerlemesi güncellendi"
    });
  } catch (error) {
    console.error('Update watch progress error:', error);
    res.status(500).json({
      success: false,
      message: "İzleme ilerlemesi güncellenemedi"
    });
  }
};

// Get user's list (watchlist, favorites, completed)
export const handleGetUserList: RequestHandler = async (req, res) => {
  try {
    const { userId, listType } = req.params;
    const userIdNum = parseInt(userId);

    if (!userIdNum || !listType) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz parametreler"
      });
    }

    if (!['watchlist', 'favorites', 'completed'].includes(listType)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz liste tipi"
      });
    }

    const userList = await getUserList(userIdNum, listType);
    
    const transformedList = userList.map(item => ({
      animeId: item.anime_id.toString(),
      addedAt: item.added_at,
      anime: {
        title: item.title,
        poster: item.poster,
        rating: item.rating,
        year: item.year
      }
    }));

    res.json({
      success: true,
      data: transformedList
    });
  } catch (error) {
    console.error('Get user list error:', error);
    res.status(500).json({
      success: false,
      message: "Kullanıcı listesi alınamadı"
    });
  }
};

// Add anime to user's list
export const handleAddToUserList: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { animeId, listType } = req.body;
    
    const userIdNum = parseInt(userId);
    const animeIdNum = parseInt(animeId);

    if (!userIdNum || !animeIdNum || !listType) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz parametreler"
      });
    }

    if (!['watchlist', 'favorites', 'completed'].includes(listType)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz liste tipi"
      });
    }

    await addToUserList(userIdNum, animeIdNum, listType);

    res.json({
      success: true,
      message: "Anime listeye eklendi"
    });
  } catch (error) {
    console.error('Add to user list error:', error);
    res.status(500).json({
      success: false,
      message: "Anime listeye eklenemedi"
    });
  }
};

// Remove anime from user's list
export const handleRemoveFromUserList: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { animeId, listType } = req.body;
    
    const userIdNum = parseInt(userId);
    const animeIdNum = parseInt(animeId);

    if (!userIdNum || !animeIdNum || !listType) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz parametreler"
      });
    }

    if (!['watchlist', 'favorites', 'completed'].includes(listType)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz liste tipi"
      });
    }

    await removeFromUserList(userIdNum, animeIdNum, listType);

    res.json({
      success: true,
      message: "Anime listeden çıkarıldı"
    });
  } catch (error) {
    console.error('Remove from user list error:', error);
    res.status(500).json({
      success: false,
      message: "Anime listeden çıkarılamadı"
    });
  }
};
