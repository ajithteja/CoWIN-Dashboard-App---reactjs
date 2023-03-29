import Loader from 'react-loader-spinner'
import {Component} from 'react'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: 'INITIAL',
    vaccinationData: {},
  }

  componentDidMount = () => {
    this.getVaccinationData()
  }

  successfullyFetched = async response => {
    const data = await response.json()
    const formateData = {
      last7DaysVaccination: data.last_7_days_vaccination.map(eachData => ({
        dose1: eachData.dose_1,
        dose2: eachData.dose_2,
        vaccineDate: eachData.vaccine_date,
      })),
      vaccinationByAge: data.vaccination_by_age,
      vaccinationByGender: data.vaccination_by_gender,
    }

    this.setState({
      apiStatus: apiStatusConst.success,
      vaccinationData: formateData,
    })
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConst.inProgress,
    })

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      this.successfullyFetched(response)
    } else {
      this.setState({
        apiStatus: apiStatusConst.failure,
      })
    }
  }

  successComponentsView = () => {
    const {vaccinationData} = this.state
    return (
      <div className="success-container">
        <VaccinationCoverage
          last7DaysVaccination={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGender={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge vaccinationByAge={vaccinationData.vaccinationByAge} />
      </div>
    )
  }

  loadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureViewFunc = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  switchSuccessFailure = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'INPROGRESS':
        return this.loadingView()
      case 'SUCCESS':
        return this.successComponentsView()
      case 'FAILURE':
        return this.failureViewFunc()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-bg-container">
        <div className="cov-container">
          <div className="heading-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="website-logo"
            />
            <h1 className="main-heading">Co-WIN</h1>
          </div>
          <h1 className="sub-heading">CoWIN Vaccination in India</h1>
          {this.switchSuccessFailure()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
