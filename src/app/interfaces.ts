export interface InsuranceList {
  data: Array<{
    createdAt: string
    updatedAt: string
    id: string
    name: string
    rate: number
    status: string
  }>
  message: string
  status: string
  error: any
  timestamp: string
}
export interface UserRegister {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  role: string
}
export interface Logout {
  data: {}
  message: string
  status: string
  error: {}
  timestamp: string
}
export interface ImageTpesList {
  data: Array<{
    createdAt: string
    updatedAt: string
    id: string
    name: string
    status: string
    totalCost: number
  }>
  message: string
  status: string
  error: any
  timestamp: string
}

export interface imageTypeData {
  data: Array<{
    createdAt: string
    updatedAt: string
    id: string
    name: string
    status: string
    totalCost: number
  }>
}

export interface Patient {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    refNumber: string
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: Array<number>
    status: string
    address: string
  }
  message: string
  status: string
  error: any
  timestamp: string
}

export interface AppointmentCreation {
  patientId: string
  radiologistId: string
  technicianId: string
  insuranceId: string
  imageTypeId: string
  date: string
}
export interface Users {
  data: {
    content: Array<{
      createdAt: string
      updatedAt: string
      id: string
      firstName: string
      lastName: string
      fullName: string
      phoneNumber: string
      email: string
      role: string
      status: string
      loginStatus: string
      lastLogin?: string
    }>
    pageable: {
      sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
      }
      offset: number
      pageNumber: number
      pageSize: number
      paged: boolean
      unpaged: boolean
    }
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    numberOfElements: number
    first: boolean
    empty: boolean
  }
  message: string
  status: string
  error: any
  timestamp: string
}

export interface UserWithRole {
  data: Array<{
    createdAt: string
    updatedAt: string
    id: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
    email: string
    role: string
    status: string
    loginStatus: string
    lastLogin?: string
  }>
  message: string
  status: string
  error: any
  timestamp: string
}
export interface AppointmentData {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    refNumber: string
    date: string
    status: string
    patient: {
      createdAt: string
      updatedAt: string
      id: string
      refNumber: string
      firstName: string
      lastName: string
      phoneNumber: string
      dateOfBirth: string
      status: string
      address: string
    }
    insurance: {
      createdAt: string
      updatedAt: string
      id: string
      name: string
      rate: number
      status: string
    }
    imageType: {
      createdAt: string
      updatedAt: string
      id: string
      name: string
      status: string
      totalCost: number
    }
    radiologist: {
      createdAt: string
      updatedAt: string
      id: string
      firstName: string
      lastName: string
      fullName: string
      phoneNumber: string
      email: string
      role: string
      status: string
      loginStatus: string
      lastLogin: string
    }
    technician: {
      createdAt: string
      updatedAt: string
      id: string
      firstName: string
      lastName: string
      fullName: string
      phoneNumber: string
      email: string
      role: string
      status: string
      loginStatus: string
      lastLogin: string
    }
    amountToPay: number
    paymentStatus: string
    finalRemarks: string
    images: Array<{
      id: string
      image: {
        createdAt: string
        updatedAt: string
        id: string
        name: string
        path: string
        url: string
        size: number
        sizeType: string
        type: string
        status: string
      }
      remarks: string
    }>
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

export interface InsuranceData {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    name: string
    rate: number
    status: string
  }
  message: string
  status: string
  error: {}
  timestamp: string
}
export interface ImageTypeData {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    name: string
    totalCost: number
    status: string
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

export interface loginResponse {
  data: {
    token: {
      accessToken: string
      tokenType: string
      refreshToken: any
    }
  }
  message: string
  status: string
  error: any
  timestamp: string
}

export interface currentUserResponse {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
    email: string
    role: string
    status: string
    loginStatus: string
    lastLogin: string
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

export interface PatientsData {
  data: {
    totalPages: number
    totalElements: number
    size: number
    content: Array<{
      createdAt: string
      updatedAt: string
      id: string
      refNumber: string
      firstName: string
      lastName: string
      phoneNumber: string
      dateOfBirth: string
      status: string
      address: string
    }>
    number: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    first: boolean
    last: boolean
    numberOfElements: number
    pageable: {
      offset: number
      sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
      }
      pageNumber: number
      pageSize: number
      paged: boolean
      unpaged: boolean
    }
    empty: boolean
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

export interface ErrorResponse {
  data: any
  message: string
  status: string
  error: string
  timestamp: string
}

export interface AppointmentUserData {
  data: {
    totalPages: number
    totalElements: number
    size: number
    content: Array<{
      createdAt: string
      updatedAt: string
      id: string
      refNumber: string
      date: string
      status: string
      patient: {
        createdAt: string
        updatedAt: string
        id: string
        refNumber: string
        firstName: string
        lastName: string
        phoneNumber: string
        dateOfBirth: string
        status: string
        address: string
      }
      insurance: {
        createdAt: string
        updatedAt: string
        id: string
        name: string
        rate: number
        status: string
      }
      imageType: {
        createdAt: string
        updatedAt: string
        id: string
        name: string
        status: string
        totalCost: number
      }
      radiologist: {
        createdAt: string
        updatedAt: string
        id: string
        firstName: string
        lastName: string
        fullName: string
        phoneNumber: string
        email: string
        role: string
        status: string
        loginStatus: string
        lastLogin: string
      }
      technician: {
        createdAt: string
        updatedAt: string
        id: string
        firstName: string
        lastName: string
        fullName: string
        phoneNumber: string
        email: string
        role: string
        status: string
        loginStatus: string
        lastLogin: string
      }
      amountToPay: number
      paymentStatus: string
      finalRemarks: string
      images: Array<{
        id: string
        image: {
          createdAt: string
          updatedAt: string
          id: string
          name: string
          path: string
          url: string
          size: number
          sizeType: string
          type: string
          status: string
        }
        remarks: string
      }>
    }>
    number: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    first: boolean
    last: boolean
    numberOfElements: number
    pageable: {
      offset: number
      sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
      }
      pageNumber: number
      pageSize: number
      paged: boolean
      unpaged: boolean
    }
    empty: boolean
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

export interface UploadImageResponse {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    name: string
    path: string
    url: string
    size: number
    sizeType: string
    type: string
    status: string
  }
  message: string
  status: string
  error: {}
  timestamp: string
}
export interface AddImageResponse {
  data: {
    id: string
    image: {
      createdAt: string
      updatedAt: string
      id: string
      name: string
      path: string
      url: string
      size: number
      sizeType: string
      type: string
      status: string
    }
    remarks: string
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

export interface CheckInResponse {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    refNumber: string
    date: string
    status: string
    patient: {
      createdAt: string
      updatedAt: string
      id: string
      refNumber: string
      firstName: string
      lastName: string
      phoneNumber: string
      dateOfBirth: string
      status: string
      address: string
    }
    insurance: {
      createdAt: string
      updatedAt: string
      id: string
      name: string
      rate: number
      status: string
    }
    imageType: {
      createdAt: string
      updatedAt: string
      id: string
      name: string
      status: string
      totalCost: number
    }
    radiologist: {
      createdAt: string
      updatedAt: string
      id: string
      firstName: string
      lastName: string
      fullName: string
      phoneNumber: string
      email: string
      role: string
      status: string
      loginStatus: string
      lastLogin: string
    }
    technician: {
      createdAt: string
      updatedAt: string
      id: string
      firstName: string
      lastName: string
      fullName: string
      phoneNumber: string
      email: string
      role: string
      status: string
      loginStatus: string
      lastLogin: string
    }
    amountToPay: number
    paymentStatus: string
    finalRemarks: string
    images: Array<{
      id: string
      image: {
        createdAt: string
        updatedAt: string
        id: string
        name: string
        path: string
        url: string
        size: number
        sizeType: string
        type: string
        status: string
      }
      remarks: string
    }>
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

export interface StatusResponse {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
    email: string
    role: string
    status: string
    loginStatus: string
    lastLogin: any
  }
  message: string
  status: string
  error: any
  timestamp: string
}
