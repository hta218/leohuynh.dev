import timelineData from '@/data/timelineData'

const TimelineItem = ({ time, role, company, companyURL, companyBio, works }) => {
  return (
    <li>
      <div className="font-semibold leading-[18px] mb-4">{time}</div>
      <div>
        {role}{' '}
        {company ? (
          <>
            at{' '}
            <a target="_blank" rel="noopener noreferrer" href={companyURL}>
              {company}
            </a>
          </>
        ) : null}
        {companyBio ? ` - ${companyBio}` : null}
        {works ? (
          <div className="block my-2">
            <div className="mb-2">Key-works:</div>
            <div className="pl-2">
              {works.map((work, ind) => (
                <div key={ind}>- {work}</div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </li>
  )
}

const Timeline = () => {
  return (
    <div className="timeline container">
      <div className="wrapper">
        <ul className="sessions">
          {timelineData.map((item) => (
            <TimelineItem key={item.time} {...item} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Timeline
