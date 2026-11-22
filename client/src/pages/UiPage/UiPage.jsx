import ButtonLike from '../../components/ui//ButtonLike/ButtonLike'
import RatingStars from '../../components/ui/RatingStars/RatingStars'

export function UiPage() {
    return (<>
        <ButtonLike active={false}/>
        <RatingStars value={5}/>
    </>)
    
}