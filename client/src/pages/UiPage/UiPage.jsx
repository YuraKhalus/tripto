import ButtonLike from '../../components/ui//ButtonLike/ButtonLike'
import RatingStars from '../../components/ui/RatingStars/RatingStars'
import PropertyCard from '../../components/ui/PropertyCard/PropertyCard'
import SortDropdown from '../../components/ui/SortDropdown/SortDropdown'

const data = [
    {value: 'Recommended', label: 'Recommended'},
    {value: 'Distance (Near to Far)', label: 'Distance (Near to Far)'},
    {value: 'Top Reviewed', label: 'Top Reviewed'},
    {value: 'Highest Price', label: 'Highest Price'},
    {value: 'Lowest Price', label: 'Lowest Price'},
    {value: 'Star Rating (high to Low)', label: 'Star Rating (high to Low)'},
]


export function UiPage() {
    return (<>
        <ButtonLike active={false}/>
        <RatingStars value={3} starsFiling='full'/>
        <PropertyCard cardFiling='horizontal'/>
        <SortDropdown options={data}/>
    </>)
    
}