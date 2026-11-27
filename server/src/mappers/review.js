export function toReview(review){
    return {
        id: review.id,
        reviewerName: review.reviewerName,
        date: review.date.toISOString().slice(0, 10),
        comments: review.comments
    };
}