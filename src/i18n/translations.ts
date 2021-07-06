import { Translation } from "./locale";

export const translationKeys = [
  "app.title",
  "app.subtitle",
  "app.description",
  "credentials.step_name",
  "credentials.success_indicator",
  "credentials.description",
  "student_info.step_name",
  "student_info.description",
  "student_info.not_found_indicator",
  "student_info.not_found_help_text",
  "data_explorer.step_name",
  "data_explorer.description",
] as const;

export const translations: Translation<typeof translationKeys[number]> = {
  en: {
    "app.title": "Personal Data Recovery Tool",
    "app.subtitle": "Wellbeing with Data Analytics",
    "app.description": `This tool can be used to retrieve the session token using the e-mail
    address of the participants. If you correctly entered the RescueTime API
    Key, it will also be shown. For those that did not enter the API Key
    correctly yet wish to add it, so that their data can be correlated
    correctly, please send a mail to Gregor. If you have any questions, feel
    free to mail / ask us or post a question in the forum.`,
    "credentials.step_name": "Provide Credentials",
    "credentials.success_indicator": "Correct",
    "credentials.description": `We don't want to expose all data to all our students for privacy
    reasons. Please enter your E-Mail Address and your age (the age
    you provided us with during the initial questionnaire).`,
    "student_info.step_name": "Student Information for",
    "student_info.description": `Data you entered during the initial questionnaire`,
    "student_info.not_found_indicator": "Not found",
    "student_info.not_found_help_text": `Feel free to send a mail to Gregor if you want your API
    Key to be included in the study`,
    "data_explorer.step_name": "Data Explorer",
    "data_explorer.description": `To develop your report you may want to use the data we provide
    you with here. Some cleaning steps are done for you so that you
    get faster results. Though you still might want to clean the
    data for your use case.`,
  }
}


export type TranslationKey = typeof translations.en;