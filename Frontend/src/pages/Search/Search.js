import { getMetadata, getSong } from '../../services/pytube'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import * as PlayActions from '../../store/actions/play'
import * as SearchActions from '../../store/actions/search'
import Play from '../../components/icons/Play'
import styles from "./Search.module.css"
import Duration from '../../components/icons/Duration'
import Like from '../../components/icons/Like'
import Options from '../../components/icons/Options'
import convertTime from '../../helpers/convertTime'
import equalizer from '../../assets/gif/equalizer.gif'
import useToggle from './hooks/useToggle'
import { useMemo } from 'react'

function Search({searchResult, setSongMetaData, setSongTrackData, isPlaying, setIsPlaying, clearOldRequests}) {

    const initialState = {}
    // const[active, setActive] = useState(initialState)
    // const[ready, setReady] = useState(initialState)
    // const [active, indexActive, ready] = useToggleSong(0);
    const[index, setIndex] = useState()
    const [active, toggleActive, setActiveOn] = useToggle()
    const [ready, toggleReady, setReadyOn] = useToggle()

    useEffect(() => {
        clearOldRequests()
        console.log("search render")
        console.log(active)
    }, [])

    useEffect(() => {
        setIsPlaying(active[index])
    }, [])

    useEffect(() => {
        toggleActive(isPlaying)
    }, [isPlaying])

    async function play(index, title, artist, img){
        
        setIndex(index)
        if(!active[index] && !ready[index]){
            const audio = (await getSong(index)).audio
            setSongTrackData(audio)
            setSongMetaData(title, artist, img)

            setActiveOn(index)
            setReadyOn(index)

            setIsPlaying(true)
        }
        else {
            toggleActive(index)
        }
    }

    const[width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth));
    }, [])

    return ( 
        <div className={styles.container}>
            <div className={styles.categories_container}>
                <div className={styles.categories}>
                    <button>
                        <span>Tudo</span>
                    </button>
                    <button id={styles.highlight}>
                        <span>Músicas</span>
                    </button>
                    <button>
                        <span>Álbuns</span>
                    </button>
                    <button>
                        <span>Artistas</span>
                    </button>
                    <button>
                        <span>Playlists</span>
                    </button>
                    <button>
                        <span>Podcasts e programas</span>
                    </button>
                </div>
            </div>
            <div className={styles.search_result_container}>
                <div className={styles.list_header}>
                    <div className={styles.grid}>
                        <div className={styles.index}>#</div>
                        <div className={styles.title}>
                            <span>Título</span>
                        </div>
                        {width > 776 && (
                            <div className={styles.album}>
                                <span>Álbum</span>
                            </div>
                        )}
                        <div className={styles.duration}>
                            <span><Duration size='16' /></span>
                        </div>
                    </div>
                </div>
                <ul className={styles.song_list}>
                    {searchResult.map((song, index) => {
                        return(
                            <li className={styles.list_item} key={index}>
                                <div className={styles.song_index}>
                                    <div id={active[index+1] ? `${styles.active}` : ""}>
                                        <span id={ready[index+1] ? `${styles.active}` : ""}>{index+1}</span>
                                        <img src={equalizer} width='14' height='20'></img>
                                        <button onClick={() => play(index+1, song.title, song.artist, song.cover)}><Play size='12' active={active[index+1]}/></button>
                                    </div>
                                </div>
                                <div className={styles.song_details}>
                                    <img src={song.cover} alt='cover'/>
                                    <div>
                                        <div className={styles.title} id={ready[index+1] ? `${styles.active}` : ""}>{song.title}</div>
                                        <span id={styles.artist}>{song.artist}</span>
                                    </div>
                                </div>
                                {width > 776 && (
                                    <div className={styles.song_album}>
                                        <span>{song.album}</span>
                                    </div>
                                )}
                                <div className={styles.song_duration}>
                                    <button id={styles.like}><Like size='18'/></button>
                                    <span id={styles.time}>{convertTime(song.duration)}</span>
                                    <button id={styles.options}><Options size='18'/></button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isPlaying: state.play.isPlaying,
    searchResult: state.search.searchData
})

const mapDispatchToProps = dispatch => ({
    setSongMetaData: (title, artist, img) => dispatch(PlayActions.setSongMetaData(title, artist, img)),
    setSongTrackData:(trackData) => dispatch(PlayActions.setSongTrackData(trackData)),
    setIsPlaying: (status) => dispatch(PlayActions.setIsPlaying(status)),
    clearOldRequests: () => dispatch(SearchActions.clearOldRequests())
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
