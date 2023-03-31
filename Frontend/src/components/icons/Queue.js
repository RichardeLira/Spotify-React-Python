import React from 'react';

const Queue = ({size}) => {
    
    const fill = "#bababa"

    return(
        <svg width={size} height={size} viewBox="0 0 51 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M48.095 41.4707C48.095 41.2893 47.9421 41.1531 47.7513 41.1531C43.7911 41.1531 6.28846 41.1531 2.32826 41.1531C2.14695 41.1531 1.99426 41.2893 1.99426 41.4707C1.99426 42.4144 1.99426 45.173 1.99426 46.1258C1.99426 46.2982 2.14695 46.4434 2.32826 46.4434C6.28846 46.4434 43.7911 46.4434 47.7513 46.4434C47.9421 46.4434 48.095 46.2982 48.095 46.1258V41.4707ZM48.095 27.0794C48.095 26.907 47.9421 26.7618 47.7513 26.7618C43.7911 26.7618 6.28846 26.7618 2.32826 26.7618C2.14695 26.7618 1.99426 26.907 1.99426 27.0794C1.99426 28.0322 1.99426 30.7908 1.99426 31.7344C1.99426 31.9069 2.14695 32.052 2.32826 32.052C6.28846 32.052 43.7911 32.052 47.7513 32.052C47.9421 32.052 48.095 31.9069 48.095 31.7344V27.0794ZM0 8.77725C0 4.18581 3.91249 0.465332 8.73152 0.465332H41.3957C46.2148 0.465332 50.175 4.18581 50.175 8.77725C50.175 13.3596 46.2148 17.08 41.3957 17.08H8.73152C3.91249 17.08 0 13.3596 0 8.77725ZM5.56307 8.77725C5.56307 7.10764 6.98522 5.76458 8.73152 5.76458H41.3957C43.142 5.76458 44.5642 7.10764 44.5642 8.77725C44.5642 10.4378 43.142 11.7897 41.3957 11.7897H8.73152C6.98522 11.7897 5.56307 10.4378 5.56307 8.77725Z" fill={fill}/>
        </svg>
    )
}

export default Queue