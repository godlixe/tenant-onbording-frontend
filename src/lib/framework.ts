const checkIntegratedMode = () => {
    return process.env.INTEGRATED_MODE == "true"
}

export default checkIntegratedMode