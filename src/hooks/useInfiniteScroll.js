import { useEffect, useCallback } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

const useInfiniteScroll = (hasMore, isLoading, onLoadMore) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px'
  });

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && isIntersecting) {
      onLoadMore();
    }
  }, [hasMore, isLoading, isIntersecting, onLoadMore]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return { targetRef };
};

export default useInfiniteScroll;
