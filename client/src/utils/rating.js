export default function getRatingLabel(score) {
    if (score >= 4.5) return 'Excellent'

    if (score >= 4) return 'Very Good'

    if (score >= 3) return 'Good'

    if (score >= 2) return 'Fair'

    return 'Poor'
}